import { Injectable, Logger } from '@nestjs/common';
import { OpenWeatherMapProvider } from './providers/openweathermap.provider';
import { OrionClientProvider } from './providers/orion-client.provider';
import {
  transformOWMAirPollutionToNGSILD,
  transformOWMToNGSILD,
  transformOWMAirPollutionForecastToNGSILD,
  transformOWMDailyForecastToNGSILD,
} from '../../common/transformers/ngsi-ld.transformer';
import sourceLocationsData from './source_data.json';

/**
 * Interface for weather location data
 */
interface WeatherLocation {
  id: string;
  type: string;
  name: string;
  district: string;
  location: {
    lat: number;
    lon: number;
  };
}

/**
 * Ingestion Service
 * Orchestrates data collection from external APIs and pushes to Orion-LD
 */
@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);
  private readonly locations: WeatherLocation[];

  constructor(
    private readonly owmProvider: OpenWeatherMapProvider,
    private readonly orionClient: OrionClientProvider,
  ) {
    // Load source locations from JSON file
    this.locations = sourceLocationsData as unknown as WeatherLocation[];
    this.logger.log(
      `Loaded ${this.locations.length} monitoring locations from source_data.json`,
    );
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
    this.logger.log(
      `Starting air quality data ingestion (current + forecast) for ${this.locations.length} locations`,
    );

    let successCount = 0;
    let failedCount = 0;
    let forecastSuccessCount = 0;
    let forecastFailedCount = 0;
    const errors: any[] = [];

    for (const location of this.locations) {
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

        // Upsert all forecast entities
        await this.orionClient.upsertEntities(forecastEntities);

        this.logger.debug(
          `✓ Air quality forecast (${forecastEntities.length} entries) ingested for ${location.name}`,
        );
        forecastSuccessCount++;
      } catch (error) {
        this.logger.error(
          `✗ Failed to ingest air quality forecast for ${location.name}`,
          error.message,
        );
        forecastFailedCount++;
        errors.push({
          location: location.name,
          type: 'forecast',
          error: error.message,
        });
      }
    }

    this.logger.log(
      `Air quality ingestion completed: Current(${successCount}/${this.locations.length}), Forecast(${forecastSuccessCount}/${this.locations.length})`,
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
    this.logger.log(
      `Starting weather data ingestion (current + 7-day forecast) for ${this.locations.length} locations`,
    );

    let successCount = 0;
    let failedCount = 0;
    let forecastSuccessCount = 0;
    let forecastFailedCount = 0;
    const errors: any[] = [];

    for (const location of this.locations) {
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

        // Upsert all forecast entities
        await this.orionClient.upsertEntities(forecastEntities);

        this.logger.debug(
          `✓ Weather forecast (${forecastEntities.length} days) ingested for ${location.name}`,
        );
        forecastSuccessCount++;
      } catch (error) {
        this.logger.error(
          `✗ Failed to ingest weather forecast for ${location.name}`,
          error.message,
        );
        forecastFailedCount++;
        errors.push({
          location: location.name,
          type: 'forecast',
          error: error.message,
        });
      }
    }

    this.logger.log(
      `Weather ingestion completed: Current(${successCount}/${this.locations.length}), Forecast(${forecastSuccessCount}/${this.locations.length})`,
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
  getMonitoringLocations(): WeatherLocation[] {
    return this.locations;
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
