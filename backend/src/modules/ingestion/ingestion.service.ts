import { Injectable, Logger } from '@nestjs/common';
import { OpenWeatherMapProvider } from './providers/openweathermap.provider';
import { OrionClientProvider } from './providers/orion-client.provider';
import {
  transformOWMAirPollutionToNGSILD,
  transformOWMToNGSILD,
} from '../../common/transformers/ngsi-ld.transformer';
import * as sourceLocations from './source_data.json';

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
    this.locations = sourceLocations as WeatherLocation[];
    this.logger.log(
      `Loaded ${this.locations.length} monitoring locations from source_data.json`,
    );
  }

  /**
   * Ingest air quality data for all configured locations
   * Fetches from OpenWeatherMap and pushes to Orion-LD
   */
  async ingestAirQualityData(): Promise<{
    success: number;
    failed: number;
    errors: any[];
  }> {
    this.logger.log(
      `Starting air quality data ingestion for ${this.locations.length} locations`,
    );

    let successCount = 0;
    let failedCount = 0;
    const errors: any[] = [];

    for (const location of this.locations) {
      try {
        // Fetch air pollution data from OpenWeatherMap
        const owmData = await this.owmProvider.getCurrentAirPollution(
          location.location.lat,
          location.location.lon,
        );

        // Transform to NGSI-LD format
        const ngsiLdEntity = transformOWMAirPollutionToNGSILD(
          owmData,
          location.name,
          location.district,
        );

        // Upsert to Orion-LD
        await this.orionClient.upsertEntity(ngsiLdEntity);

        this.logger.debug(`✓ Air quality data ingested for ${location.name}`);
        successCount++;
      } catch (error) {
        this.logger.error(
          `✗ Failed to ingest air quality data for ${location.name}`,
          error.message,
        );
        failedCount++;
        errors.push({
          location: location.name,
          error: error.message,
        });
      }
    }

    this.logger.log(
      `Air quality ingestion completed: ${successCount} succeeded, ${failedCount} failed`,
    );

    return {
      success: successCount,
      failed: failedCount,
      errors,
    };
  }

  /**
   * Ingest weather data for all configured locations
   * Fetches from OpenWeatherMap and pushes to Orion-LD
   */
  async ingestWeatherData(): Promise<{
    success: number;
    failed: number;
    errors: any[];
  }> {
    this.logger.log(
      `Starting weather data ingestion for ${this.locations.length} locations`,
    );

    let successCount = 0;
    let failedCount = 0;
    const errors: any[] = [];

    for (const location of this.locations) {
      try {
        // Fetch current weather from OpenWeatherMap
        const owmData = await this.owmProvider.getCurrentWeather(
          location.location.lat,
          location.location.lon,
          'metric', // Use Celsius
          'vi', // Vietnamese language
        );

        // Transform to NGSI-LD format
        const ngsiLdEntity = transformOWMToNGSILD(
          owmData,
          location.name,
          location.district,
        );

        // Upsert to Orion-LD
        await this.orionClient.upsertEntity(ngsiLdEntity);

        this.logger.debug(`✓ Weather data ingested for ${location.name}`);
        successCount++;
      } catch (error) {
        this.logger.error(
          `✗ Failed to ingest weather data for ${location.name}`,
          error.message,
        );
        failedCount++;
        errors.push({
          location: location.name,
          error: error.message,
        });
      }
    }

    this.logger.log(
      `Weather ingestion completed: ${successCount} succeeded, ${failedCount} failed`,
    );

    return {
      success: successCount,
      failed: failedCount,
      errors,
    };
  }

  /**
   * Ingest both air quality and weather data
   * Runs both ingestion processes in parallel
   */
  async ingestAllData(): Promise<{
    airQuality: { success: number; failed: number; errors: any[] };
    weather: { success: number; failed: number; errors: any[] };
  }> {
    this.logger.log('Starting full data ingestion (Air Quality + Weather)');

    const [airQualityResult, weatherResult] = await Promise.all([
      this.ingestAirQualityData(),
      this.ingestWeatherData(),
    ]);

    this.logger.log(
      `Full ingestion completed: AQ(${airQualityResult.success}/${this.locations.length}), Weather(${weatherResult.success}/${this.locations.length})`,
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
