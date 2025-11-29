import { Injectable, Logger } from '@nestjs/common';
import { OpenWeatherMapProvider } from './providers/openweathermap.provider';
import { OrionClientProvider } from './providers/orion-client.provider';
import { StationService } from '../stations/station.service';
import { StationStatus } from '../stations/dto/station.dto';
import {
  transformOWMAirPollutionToNGSILD,
  transformOWMToNGSILD,
  transformOWMAirPollutionForecastToNGSILD,
  transformOWMDailyForecastToNGSILD,
} from '../../common/transformers/ngsi-ld.transformer';

/**
 * Ingestion Service
 * Orchestrates data collection from external APIs and pushes to Orion-LD
 */
@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private readonly owmProvider: OpenWeatherMapProvider,
    private readonly orionClient: OrionClientProvider,
    private readonly stationManager: StationService,
  ) {}

  /**
   * Ingest air quality data for all active stations
   */
  async ingestAirQualityData(): Promise<{
    success: number;
    failed: number;
    errors: any[];
    forecastSuccess: number;
    forecastFailed: number;
  }> {
    const locations = await this.stationManager.findAll({
      status: StationStatus.ACTIVE,
    });

    this.logger.log(
      `Starting air quality ingestion for ${locations.length} active stations`,
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
          location.code,
          location.id,
          location.city || 'Unknown',
          location.district,
        );

        await this.orionClient.upsertEntity(ngsiLdEntity);

        this.logger.debug(
          `✓ Current air quality data ingested for ${location.code}`,
        );
        successCount++;
      } catch (error) {
        this.logger.error(
          `✗ Failed to ingest current air quality for ${location.code}`,
          error.message,
        );
        failedCount++;
        errors.push({
          location: location.code,
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
          location.code,
          location.id,
          location.city || 'Unknown',
          location.district,
        );

        this.logger.debug(
          `Upserting ${forecastEntities.length} air quality forecast entities for ${location.code}`,
        );

        // Upsert all forecast entities with batching (default batch size: 50)
        await this.orionClient.upsertEntities(forecastEntities);

        this.logger.debug(
          `✓ Air quality forecast (${forecastEntities.length} entries) ingested for ${location.code}`,
        );
        forecastSuccessCount++;
      } catch (error) {
        this.logger.error(
          `✗ Failed to ingest air quality forecast for ${location.code}`,
          error.stack || error.message,
        );
        forecastFailedCount++;
        errors.push({
          location: location.code,
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
   * Ingest weather data for all active stations
   */
  async ingestWeatherData(): Promise<{
    success: number;
    failed: number;
    errors: any[];
    forecastSuccess: number;
    forecastFailed: number;
  }> {
    const locations = await this.stationManager.findAll({
      status: StationStatus.ACTIVE,
    });

    this.logger.log(
      `Starting weather ingestion for ${locations.length} active stations`,
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
          location.code,
          location.id,
          location.city,
          location.district,
        );

        await this.orionClient.upsertEntity(ngsiLdEntity);

        this.logger.debug(
          `✓ Current weather data ingested for ${location.code}`,
        );
        successCount++;
      } catch (error) {
        this.logger.error(
          `✗ Failed to ingest current weather for ${location.code}`,
          error.message,
        );
        failedCount++;
        errors.push({
          location: location.code,
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
          location.code,
          location.id,
          location.city || 'Unknown',
          location.district,
        );

        this.logger.debug(
          `Upserting ${forecastEntities.length} weather forecast entities for ${location.code}`,
        );

        // Upsert all forecast entities with batching (default batch size: 50)
        await this.orionClient.upsertEntities(forecastEntities);

        this.logger.debug(
          `✓ Weather forecast (${forecastEntities.length} days) ingested for ${location.code}`,
        );
        forecastSuccessCount++;
      } catch (error) {
        this.logger.error(
          `✗ Failed to ingest weather forecast for ${location.code}`,
          error.stack || error.message,
        );
        forecastFailedCount++;
        errors.push({
          location: location.code,
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
  async getMonitoringLocations() {
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
