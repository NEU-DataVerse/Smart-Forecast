import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AirQualityObservedEntity } from '../persistence/entities/air-quality-observed.entity';
import { AirQualityForecastEntity } from '../persistence/entities/air-quality-forecast.entity';
import { OrionClientProvider } from '../ingestion/providers/orion-client.provider';
import { StationsService } from '../stations/stations.service';
import {
  transformNGSILDAirQualityForecastToOWM,
  extractPropertyValue,
} from '../../common/transformers/owm-response.transformer';
import {
  IAirQualityObserved,
  IAirQualityDataPoint,
  IAirQualityForecastResponse,
} from '@smart-forecast/shared';

/**
 * Air Quality Service
 *
 * Handles air quality data retrieval from Orion-LD and PostgreSQL
 */
@Injectable()
export class AirQualityService {
  private readonly logger = new Logger(AirQualityService.name);

  constructor(
    @InjectRepository(AirQualityObservedEntity)
    private readonly airQualityRepo: Repository<AirQualityObservedEntity>,
    @InjectRepository(AirQualityForecastEntity)
    private readonly airQualityForecastRepo: Repository<AirQualityForecastEntity>,
    private readonly orionClient: OrionClientProvider,
    private readonly stationsService: StationsService,
  ) {}

  /**
   * Get current air quality for a station
   */
  async getCurrentAirQuality(stationId: string): Promise<IAirQualityObserved> {
    // Validate station exists
    this.stationsService.getStationById(stationId);

    try {
      // Query Orion-LD for latest observation
      const entities = await this.orionClient.queryEntities({
        type: 'AirQualityObserved',
        q: `locationId=='${stationId}'`,
        limit: 1,
        orderBy: 'dateObserved',
        sortOrder: 'desc',
      });

      if (!entities || entities.length === 0) {
        throw new NotFoundException(
          `No current air quality data found for station ${stationId}`,
        );
      }

      const entity = entities[0];

      // Transform NGSI-LD to interface
      return this.transformToAirQualityObserved(entity);
    } catch (error) {
      this.logger.error(
        `Failed to fetch current air quality for ${stationId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get historical air quality data
   */
  async getAirQualityHistory(
    stationId: string,
    startDate?: string,
    endDate?: string,
    limit: number = 100,
  ): Promise<IAirQualityDataPoint[]> {
    // Validate station exists
    this.stationsService.getStationById(stationId);

    try {
      const queryOptions: any = {
        where: { locationId: stationId },
        order: { dateObserved: 'ASC' as const },
        take: limit,
      };

      // Add date range filter if provided
      if (startDate && endDate) {
        queryOptions.where.dateObserved = Between(
          new Date(startDate),
          new Date(endDate),
        );
      } else if (startDate) {
        // Default to last 30 days if only start provided
        const end = new Date();
        queryOptions.where.dateObserved = Between(new Date(startDate), end);
      }

      const entities = await this.airQualityRepo.find(queryOptions);

      return entities.map((entity) => ({
        timestamp: entity.dateObserved,
        aqi: entity.aqi || 0,
        pm25: entity.pm25 || undefined,
        pm10: entity.pm10 || undefined,
        category: this.getAQICategory(entity.aqi ?? undefined),
      }));
    } catch (error) {
      this.logger.error(
        `Failed to fetch air quality history for ${stationId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get air quality forecast
   */
  async getAirQualityForecast(
    stationId: string,
    hours: number = 96,
  ): Promise<IAirQualityForecastResponse> {
    // Validate station exists
    const station = this.stationsService.getStationById(stationId);

    try {
      const now = new Date().toISOString();

      // Query Orion-LD for forecast entities
      const entities = await this.orionClient.queryEntities({
        type: 'AirQualityForecast',
        q: `locationId=='${stationId}';validFrom>='${now}'`,
        limit: hours,
        orderBy: 'validFrom',
        sortOrder: 'asc',
      });

      if (!entities || entities.length === 0) {
        this.logger.warn(
          `No forecast data found in Orion-LD for ${stationId}, trying PostgreSQL`,
        );

        // Fallback to PostgreSQL
        return await this.getAirQualityForecastFromDB(stationId, hours);
      }

      // Transform to OWM format
      return transformNGSILDAirQualityForecastToOWM(entities, station);
    } catch (error) {
      this.logger.error(
        `Failed to fetch air quality forecast for ${stationId}`,
        error.stack,
      );

      // Fallback to PostgreSQL on error
      try {
        return await this.getAirQualityForecastFromDB(stationId, hours);
      } catch (dbError) {
        this.logger.error('PostgreSQL fallback also failed', dbError.stack);
        // Return empty forecast instead of throwing
        return {
          coord: {
            lat: station.location.lat,
            lon: station.location.lon,
          },
          list: [],
        };
      }
    }
  }

  /**
   * Get forecast from PostgreSQL (fallback)
   */
  private async getAirQualityForecastFromDB(
    stationId: string,
    hours: number,
  ): Promise<IAirQualityForecastResponse> {
    const station = this.stationsService.getStationById(stationId);
    const now = new Date();

    const entities = await this.airQualityForecastRepo.find({
      where: {
        locationId: stationId,
      },
      order: { validFrom: 'ASC' as const },
      take: hours,
    });

    // Transform database entities to OWM format
    const list = entities
      .filter((e) => e.validFrom >= now)
      .map((entity) => ({
        dt: Math.floor(entity.validFrom.getTime() / 1000),
        main: {
          aqi: entity.airQualityIndex || 1,
        },
        components: {
          co: entity.co || undefined,
          no: entity.no || undefined,
          no2: entity.no2 || undefined,
          o3: entity.o3 || undefined,
          so2: entity.so2 || undefined,
          pm2_5: entity.pm25 || undefined,
          pm10: entity.pm10 || undefined,
          nh3: entity.nh3 || undefined,
        },
      }));

    return {
      coord: {
        lat: station.location.lat,
        lon: station.location.lon,
      },
      list,
    };
  }

  /**
   * Transform NGSI-LD entity to IAirQualityObserved
   */
  private transformToAirQualityObserved(entity: any): IAirQualityObserved {
    const dateObserved = extractPropertyValue(entity.dateObserved);
    return {
      id: entity.id,
      type: 'AirQualityObserved',
      dateObserved: new Date(dateObserved || new Date()),
      location: extractPropertyValue(entity.location) || {
        type: 'Point',
        coordinates: [0, 0],
      },
      address: extractPropertyValue(entity.address),
      pm25: extractPropertyValue(entity.pm25),
      pm10: extractPropertyValue(entity.pm10),
      no2: extractPropertyValue(entity.no2),
      so2: extractPropertyValue(entity.so2),
      co: extractPropertyValue(entity.co),
      o3: extractPropertyValue(entity.o3),
      aqi: extractPropertyValue(entity.aqi),
      aqiCategory: this.getAQICategory(
        extractPropertyValue(entity.aqi),
      ) as IAirQualityObserved['aqiCategory'],
      source: extractPropertyValue(entity.dataProvider) || 'OpenWeatherMap',
    };
  }

  /**
   * Get AQI category from numeric value
   */
  private getAQICategory(aqi?: number): string | undefined {
    if (!aqi) return undefined;

    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }
}
