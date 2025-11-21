import { Injectable, Logger } from '@nestjs/common';
import { OpenWeatherMapProvider } from './providers/openweathermap.provider';
import { OrionClientProvider } from './providers/orion-client.provider';
import { StationManagerService } from './providers/station-manager.provider';
import { WeatherStation } from './dto/station.dto';
import {
  transformOWMAirPollutionToNGSILD,
  transformOWMToNGSILD,
  transformOWMAirPollutionForecastToNGSILD,
  transformOWMDailyForecastToNGSILD,
} from '../../common/transformers/ngsi-ld.transformer';

/**
 * Ingestion Service
 * Orchestrates data collection from external APIs and pushes to Orion-LD
 * Uses StationManager for dynamic station configuration
 */
@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private readonly owmProvider: OpenWeatherMapProvider,
    private readonly orionClient: OrionClientProvider,
    private readonly stationManager: StationManagerService,
  ) {
    this.logger.log('IngestionService initialized with StationManager');
  }

  /**
   * Ingest air quality data for all configured locations
   * Fetches current data + forecast from OpenWeatherMap and pushes to Orion-LD
   */
  async ingestAirQualityData(): Promise<{
    success: number;
    failed: number;
    errors: any[];
    forecastSuccess: number;
    forecastFailed: number;
  }> {
    // Get active stations from StationManager
    const locations = this.stationManager.findActive();

    this.logger.log(
      `Starting air quality data ingestion (current + forecast) for ${locations.length} active stations`,
    );

    let successCount = 0;
    let failedCount = 0;
    let forecastSuccessCount = 0;
    let forecastFailedCount = 0;
    const errors: any[] = [];

    for (const location of locations) {
      // Ingest current air quality data
      try {
        const owmData = await this.owmProvider.getCurrentAirPollution(
          location.location.lat,
          location.location.lon,
        );

        const ngsiLdEntity = transformOWMAirPollutionToNGSILD(
          owmData,
          location.name,
          location.district,
        );

        // Add locationId relationship for easy querying
        ngsiLdEntity.locationId = {
          type: 'Relationship',
          object: location.id,
        };

        await this.orionClient.upsertEntity(ngsiLdEntity);

        this.logger.debug(
          `✓ Current air quality data ingested for ${location.name}`,
        );
        successCount++;
      } catch (error) {
        this.logger.error(
          `✗ Failed to ingest current air quality for ${location.name}`,
          error.message,
        );
        failedCount++;
        errors.push({
          location: location.name,
          type: 'current',
          error: error.message,
        });
      }

      // Ingest air quality forecast data
      try {
        const owmForecastData = await this.owmProvider.getAirPollutionForecast(
          location.location.lat,
          location.location.lon,
        );

        const forecastEntities = transformOWMAirPollutionForecastToNGSILD(
          owmForecastData,
          location.name,
          location.district,
        );

        // Add locationId relationship to all forecast entities
        forecastEntities.forEach((entity) => {
          entity.locationId = {
            type: 'Relationship',
            object: location.id,
          };
        });

        this.logger.debug(
          `Upserting ${forecastEntities.length} air quality forecast entities for ${location.name}`,
        );

        // Upsert all forecast entities with batching (default batch size: 50)
        await this.orionClient.upsertEntities(forecastEntities);

        this.logger.debug(
          `✓ Air quality forecast (${forecastEntities.length} entries) ingested for ${location.name}`,
        );
        forecastSuccessCount++;
      } catch (error) {
        this.logger.error(
          `✗ Failed to ingest air quality forecast for ${location.name}`,
          error.stack || error.message,
        );
        forecastFailedCount++;
        errors.push({
          location: location.name,
          type: 'forecast',
          error: error.message,
          details: error.response?.data || error.code || 'Unknown error',
        });
      }
    }

    this.logger.log(
      `Air quality ingestion completed: Current(${successCount}/${locations.length}), Forecast(${forecastSuccessCount}/${locations.length})`,
    );

    return {
      success: successCount,
      failed: failedCount,
      forecastSuccess: forecastSuccessCount,
      forecastFailed: forecastFailedCount,
      errors,
    };
  }

  /**
   * Ingest weather data for all configured locations
   * Fetches current data + 7-day forecast from OpenWeatherMap and pushes to Orion-LD
   */
  async ingestWeatherData(): Promise<{
    success: number;
    failed: number;
    errors: any[];
    forecastSuccess: number;
    forecastFailed: number;
  }> {
    // Get active stations from StationManager
    const locations = this.stationManager.findActive();

    this.logger.log(
      `Starting weather data ingestion (current + 7-day forecast) for ${locations.length} active stations`,
    );

    let successCount = 0;
    let failedCount = 0;
    let forecastSuccessCount = 0;
    let forecastFailedCount = 0;
    const errors: any[] = [];

    for (const location of locations) {
      // Ingest current weather data
      try {
        const owmData = await this.owmProvider.getCurrentWeather(
          location.location.lat,
          location.location.lon,
          'metric', // Use Celsius
          'vi', // Vietnamese language
        );

        const ngsiLdEntity = transformOWMToNGSILD(
          owmData,
          location.name,
          location.district,
        );

        // Add locationId relationship for easy querying
        ngsiLdEntity.locationId = {
          type: 'Relationship',
          object: location.id,
        };

        await this.orionClient.upsertEntity(ngsiLdEntity);

        this.logger.debug(
          `✓ Current weather data ingested for ${location.name}`,
        );
        successCount++;
      } catch (error) {
        this.logger.error(
          `✗ Failed to ingest current weather for ${location.name}`,
          error.message,
        );
        failedCount++;
        errors.push({
          location: location.name,
          type: 'current',
          error: error.message,
        });
      }

      // Ingest weather forecast data (7 days)
      try {
        const owmDailyData = await this.owmProvider.getDailyForecast(
          location.location.lat,
          location.location.lon,
          7, // 7-day forecast
          'metric',
          'vi',
        );

        const forecastEntities = transformOWMDailyForecastToNGSILD(
          owmDailyData,
          location.name,
          location.district,
        );

        // Add locationId relationship to all forecast entities
        forecastEntities.forEach((entity) => {
          entity.locationId = {
            type: 'Relationship',
            object: location.id,
          };
        });

        this.logger.debug(
          `Upserting ${forecastEntities.length} weather forecast entities for ${location.name}`,
        );

        // Upsert all forecast entities with batching (default batch size: 50)
        await this.orionClient.upsertEntities(forecastEntities);

        this.logger.debug(
          `✓ Weather forecast (${forecastEntities.length} days) ingested for ${location.name}`,
        );
        forecastSuccessCount++;
      } catch (error) {
        this.logger.error(
          `✗ Failed to ingest weather forecast for ${location.name}`,
          error.stack || error.message,
        );
        forecastFailedCount++;
        errors.push({
          location: location.name,
          type: 'forecast',
          error: error.message,
          details: error.response?.data || error.code || 'Unknown error',
        });
      }
    }

    this.logger.log(
      `Weather ingestion completed: Current(${successCount}/${locations.length}), Forecast(${forecastSuccessCount}/${locations.length})`,
    );

    return {
      success: successCount,
      failed: failedCount,
      forecastSuccess: forecastSuccessCount,
      forecastFailed: forecastFailedCount,
      errors,
    };
  }

  /**
   * Ingest both air quality and weather data (current + forecasts)
   * Runs both ingestion processes in parallel
   */
  async ingestAllData(): Promise<{
    airQuality: {
      success: number;
      failed: number;
      forecastSuccess: number;
      forecastFailed: number;
      errors: any[];
    };
    weather: {
      success: number;
      failed: number;
      forecastSuccess: number;
      forecastFailed: number;
      errors: any[];
    };
  }> {
    this.logger.log(
      'Starting full data ingestion (Current + Forecasts: Air Quality + Weather)',
    );

    const [airQualityResult, weatherResult] = await Promise.all([
      this.ingestAirQualityData(),
      this.ingestWeatherData(),
    ]);

    this.logger.log(
      `Full ingestion completed: AQ[Current:${airQualityResult.success}, Forecast:${airQualityResult.forecastSuccess}], Weather[Current:${weatherResult.success}, Forecast:${weatherResult.forecastSuccess}]`,
    );

    return {
      airQuality: airQualityResult,
      weather: weatherResult,
    };
  }

  /**
   * Get all configured monitoring locations
   */
  getMonitoringLocations(): WeatherStation[] {
    return this.stationManager.findAll();
  }

  /**
   * Health check for all external services
   */
  async healthCheck(): Promise<{
    owm: boolean;
    orion: boolean;
  }> {
    const owmConfigured = this.owmProvider.isConfigured();
    const orionHealthy = await this.orionClient.healthCheck();

    return {
      owm: owmConfigured,
      orion: orionHealthy,
    };
  }
}
