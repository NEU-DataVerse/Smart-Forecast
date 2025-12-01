import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { OpenWeatherMapProvider } from './providers/openweathermap.provider';
import { OrionClientProvider } from './providers/orion-client.provider';
import { StationService } from '../stations/station.service';
import { StationStatus } from '../stations/dto/station.dto';
import {
  transformOWMAirPollutionToNGSILD,
  transformOWMToNGSILD,
  transformOWMAirPollutionForecastToNGSILD,
  transformOWMDailyForecastToNGSILD,
  transformOWMHistoricalAirPollutionToNGSILD,
  transformOWMHistoricalWeatherToNGSILD,
} from '../../common/transformers/ngsi-ld.transformer';
import {
  HistoricalIngestionDto,
  HistoricalIngestionType,
} from './dto/historical-ingestion.dto';

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

  /**
   * Delay helper function for rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Ingest historical air quality data for all active stations
   * Uses OpenWeatherMap Historical Air Pollution API (free)
   *
   * @param startDate Start date for historical data
   * @param endDate End date for historical data
   */
  async ingestHistoricalAirQuality(
    startDate: Date,
    endDate: Date,
  ): Promise<{
    records: number;
    errors: Array<{ station: string; error: string }>;
  }> {
    const locations = await this.stationManager.findAll({
      status: StationStatus.ACTIVE,
    });

    this.logger.log(
      `Starting historical air quality ingestion for ${locations.length} stations from ${startDate.toISOString()} to ${endDate.toISOString()}`,
    );

    const startUnix = Math.floor(startDate.getTime() / 1000);
    const endUnix = Math.floor(endDate.getTime() / 1000);

    let totalRecords = 0;
    const errors: Array<{ station: string; error: string }> = [];

    for (const location of locations) {
      try {
        this.logger.debug(
          `Fetching historical air quality for ${location.code}`,
        );

        const owmData = await this.owmProvider.getHistoricalAirPollution(
          location.location.lat,
          location.location.lon,
          startUnix,
          endUnix,
        );

        if (owmData.list && owmData.list.length > 0) {
          const entities = transformOWMHistoricalAirPollutionToNGSILD(
            owmData,
            location.code,
            location.id,
            location.city || 'Unknown',
            location.district,
          );

          await this.orionClient.upsertEntities(entities);
          totalRecords += entities.length;

          this.logger.debug(
            `✓ Ingested ${entities.length} historical air quality records for ${location.code}`,
          );
        }

        // Rate limiting: 1 second delay between stations
        await this.delay(1000);
      } catch (error) {
        this.logger.error(
          `✗ Failed to ingest historical air quality for ${location.code}`,
          error.message,
        );
        errors.push({
          station: location.code,
          error: error.message,
        });
      }
    }

    this.logger.log(
      `Historical air quality ingestion completed: ${totalRecords} records ingested`,
    );

    return { records: totalRecords, errors };
  }

  /**
   * Ingest historical weather data for all active stations
   * Uses OpenWeatherMap History API (requires paid subscription)
   *
   * @param startDate Start date for historical data
   * @param endDate End date for historical data
   */
  async ingestHistoricalWeather(
    startDate: Date,
    endDate: Date,
  ): Promise<{
    records: number;
    errors: Array<{ station: string; error: string }>;
  }> {
    const locations = await this.stationManager.findAll({
      status: StationStatus.ACTIVE,
    });

    this.logger.log(
      `Starting historical weather ingestion for ${locations.length} stations from ${startDate.toISOString()} to ${endDate.toISOString()}`,
    );

    const startUnix = Math.floor(startDate.getTime() / 1000);
    const endUnix = Math.floor(endDate.getTime() / 1000);

    let totalRecords = 0;
    const errors: Array<{ station: string; error: string }> = [];

    for (const location of locations) {
      try {
        this.logger.debug(`Fetching historical weather for ${location.code}`);

        const owmData = await this.owmProvider.getHistoricalWeather(
          location.location.lat,
          location.location.lon,
          startUnix,
          endUnix,
        );

        if (owmData.list && owmData.list.length > 0) {
          const entities = transformOWMHistoricalWeatherToNGSILD(
            owmData,
            location.code,
            location.id,
            location.city || 'Unknown',
            location.district,
          );

          await this.orionClient.upsertEntities(entities);
          totalRecords += entities.length;

          this.logger.debug(
            `✓ Ingested ${entities.length} historical weather records for ${location.code}`,
          );
        }

        // Rate limiting: 1 second delay between stations
        await this.delay(1000);
      } catch (error) {
        this.logger.error(
          `✗ Failed to ingest historical weather for ${location.code}`,
          error.message,
        );
        errors.push({
          station: location.code,
          error: error.message,
        });
      }
    }

    this.logger.log(
      `Historical weather ingestion completed: ${totalRecords} records ingested`,
    );

    return { records: totalRecords, errors };
  }

  /**
   * Ingest historical data (both weather and air quality)
   *
   * @param dto Historical ingestion DTO with date range and types
   */
  async ingestHistoricalData(dto: HistoricalIngestionDto): Promise<{
    message: string;
    weatherRecords: number;
    airQualityRecords: number;
    startDate: string;
    endDate: string;
    types: HistoricalIngestionType[];
    errors?: Array<{ station: string; type: string; error: string }>;
  }> {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    this.logger.log(
      `Starting historical data ingestion from ${startDate.toISOString()} to ${endDate.toISOString()} for types: ${dto.types.join(', ')}`,
    );

    let weatherRecords = 0;
    let airQualityRecords = 0;
    const allErrors: Array<{ station: string; type: string; error: string }> =
      [];

    // Ingest air quality if requested
    if (dto.types.includes('air-quality')) {
      const aqResult = await this.ingestHistoricalAirQuality(
        startDate,
        endDate,
      );
      airQualityRecords = aqResult.records;
      aqResult.errors.forEach((e) =>
        allErrors.push({ ...e, type: 'air-quality' }),
      );
    }

    // Ingest weather if requested
    if (dto.types.includes('weather')) {
      const weatherResult = await this.ingestHistoricalWeather(
        startDate,
        endDate,
      );
      weatherRecords = weatherResult.records;
      weatherResult.errors.forEach((e) =>
        allErrors.push({ ...e, type: 'weather' }),
      );
    }

    const totalRecords = weatherRecords + airQualityRecords;

    return {
      message: `Historical data ingestion completed: ${totalRecords} total records`,
      weatherRecords,
      airQualityRecords,
      startDate: dto.startDate,
      endDate: dto.endDate,
      types: dto.types,
      ...(allErrors.length > 0 && { errors: allErrors }),
    };
  }
}
