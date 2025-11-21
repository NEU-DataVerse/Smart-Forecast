import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { WeatherObservedEntity } from '../persistence/entities/weather-observed.entity';
import { WeatherForecastEntity } from '../persistence/entities/weather-forecast.entity';
import { OrionClientProvider } from '../ingestion/providers/orion-client.provider';
import { StationsService } from '../stations/stations.service';
import {
  transformNGSILDWeatherForecastToOWM,
  extractPropertyValue,
} from '../../common/transformers/owm-response.transformer';
import {
  IWeatherObserved,
  IWeatherDataPoint,
  IWeatherForecastResponse,
} from '@smart-forecast/shared';

/**
 * Weather Service
 *
 * Handles weather data retrieval from Orion-LD and PostgreSQL
 */
@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    @InjectRepository(WeatherObservedEntity)
    private readonly weatherRepo: Repository<WeatherObservedEntity>,
    @InjectRepository(WeatherForecastEntity)
    private readonly weatherForecastRepo: Repository<WeatherForecastEntity>,
    private readonly orionClient: OrionClientProvider,
    private readonly stationsService: StationsService,
  ) {}

  /**
   * Get current weather for a station
   */
  async getCurrentWeather(stationId: string): Promise<IWeatherObserved> {
    // Validate station exists
    const station = this.stationsService.getStationById(stationId);

    try {
      // Try Orion-LD first
      let entities;
      try {
        entities = await this.orionClient.queryEntities({
          type: 'WeatherObserved',
          q: `https://uri.etsi.org/ngsi-ld/default-context/locationId=="${stationId}"`,
          limit: 1,
          options: 'keyValues',
        });
      } catch (orionError) {
        this.logger.warn(
          `Orion-LD query failed for ${stationId}: ${orionError.message}`,
        );
        entities = [];
      }

      // Fallback to PostgreSQL if Orion-LD has no data
      if (!entities || entities.length === 0) {
        this.logger.log(
          `No current data in Orion-LD, querying PostgreSQL for ${stationId}`,
        );

        const dbEntity = await this.weatherRepo.findOne({
          where: { locationId: stationId },
          order: { dateObserved: 'DESC' },
        });

        if (!dbEntity) {
          throw new NotFoundException(
            `No current weather data found for station ${stationId}`,
          );
        }

        // Return data from PostgreSQL
        return {
          id: `urn:ngsi-ld:WeatherObserved:${stationId}-${dbEntity.dateObserved.getTime()}`,
          type: 'WeatherObserved',
          dateObserved: dbEntity.dateObserved,
          location: {
            type: 'Point',
            coordinates: [station.location.lon, station.location.lat],
          },
          temperature: dbEntity.temperature || undefined,
          feelsLikeTemperature: dbEntity.feelsLikeTemperature || undefined,
          relativeHumidity: dbEntity.relativeHumidity || undefined,
          atmosphericPressure: dbEntity.atmosphericPressure || undefined,
          windSpeed: dbEntity.windSpeed || undefined,
          windDirection: dbEntity.windDirection || undefined,
          precipitation: dbEntity.precipitation || undefined,
          weatherType: dbEntity.weatherType
            ? String(dbEntity.weatherType)
            : undefined,
          weatherDescription: dbEntity.weatherDescription || undefined,
          visibility: dbEntity.visibility || undefined,
          source: 'PostgreSQL',
        };
      }

      const entity = entities[0];

      // Transform NGSI-LD to interface
      return this.transformToWeatherObserved(entity);
    } catch (error) {
      this.logger.error(
        `Failed to fetch current weather for ${stationId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get historical weather data
   */
  async getWeatherHistory(
    stationId: string,
    startDate?: string,
    endDate?: string,
    limit: number = 100,
  ): Promise<IWeatherDataPoint[]> {
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

      const entities = await this.weatherRepo.find(queryOptions);

      if (!entities || entities.length === 0) {
        this.logger.warn(`No historical weather data found for ${stationId}`);
        return [];
      }

      // Transform to data points
      return entities.map((entity) => ({
        timestamp: entity.dateObserved,
        temperature: entity.temperature || 0,
        humidity: entity.relativeHumidity || undefined,
        precipitation: entity.precipitation || undefined,
        weatherType: entity.weatherType
          ? String(entity.weatherType)
          : undefined,
      }));
    } catch (error) {
      this.logger.error(
        `Failed to fetch weather history for ${stationId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get weather forecast for a station
   */
  async getWeatherForecast(
    stationId: string,
    days: number = 7,
  ): Promise<IWeatherForecastResponse> {
    // Validate station exists
    const station = this.stationsService.getStationById(stationId);

    try {
      // Try Orion-LD first
      let entities = await this.orionClient.queryEntities({
        type: 'WeatherForecast',
        q: `https://uri.etsi.org/ngsi-ld/default-context/locationId=="${stationId}"`,
        limit: days,
        options: 'keyValues',
      });

      // Fallback to PostgreSQL if Orion-LD has no data
      if (!entities || entities.length === 0) {
        this.logger.log(
          `No forecast in Orion-LD, querying PostgreSQL for ${stationId}`,
        );

        const forecastEntities = await this.weatherForecastRepo.find({
          where: {
            locationId: stationId,
          },
          order: { validFrom: 'ASC' },
          take: days,
        });

        if (!forecastEntities || forecastEntities.length === 0) {
          throw new NotFoundException(
            `No weather forecast found for station ${stationId}`,
          );
        }

        // Convert PostgreSQL entities to NGSI-LD format for transformer
        entities = forecastEntities.map((e) => ({
          id: `urn:ngsi-ld:WeatherForecast:${stationId}-${e.validFrom.getTime()}`,
          type: 'WeatherForecast',
          validFrom: { type: 'Property', value: e.validFrom.toISOString() },
          validTo: { type: 'Property', value: e.validTo?.toISOString() },
          dayTemp: { type: 'Property', value: e.tempDay },
          minTemp: { type: 'Property', value: e.tempMin },
          maxTemp: { type: 'Property', value: e.tempMax },
          nightTemp: { type: 'Property', value: e.tempNight },
          eveTemp: { type: 'Property', value: e.tempEve },
          mornTemp: { type: 'Property', value: e.tempMorn },
          dayFeelsLike: { type: 'Property', value: e.feelsLikeDay },
          nightFeelsLike: { type: 'Property', value: e.feelsLikeNight },
          eveFeelsLike: { type: 'Property', value: e.feelsLikeEve },
          mornFeelsLike: { type: 'Property', value: e.feelsLikeMorn },
          pressure: { type: 'Property', value: e.pressure },
          humidity: { type: 'Property', value: e.humidity },
          weatherMain: { type: 'Property', value: e.weatherType },
          weatherDescription: { type: 'Property', value: e.weatherDescription },
          weatherIcon: { type: 'Property', value: e.weatherIcon },
          windSpeed: { type: 'Property', value: e.windSpeed },
          windDeg: { type: 'Property', value: e.windDirection },
          windGust: { type: 'Property', value: e.windGust },
          clouds: { type: 'Property', value: e.clouds },
          pop: { type: 'Property', value: e.pop },
          rain: { type: 'Property', value: e.precipitation },
          snow: { type: 'Property', value: null },
        }));
      }

      // Transform NGSI-LD to OWM format
      return transformNGSILDWeatherForecastToOWM(entities, station);
    } catch (error) {
      this.logger.error(
        `Failed to fetch weather forecast for ${stationId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Transform NGSI-LD entity to WeatherObserved interface
   */
  private transformToWeatherObserved(entity: any): IWeatherObserved {
    const dateObserved = extractPropertyValue(entity.dateObserved);
    return {
      id: entity.id,
      type: 'WeatherObserved',
      dateObserved: new Date(dateObserved || new Date()),
      location: extractPropertyValue(entity.location) || {
        type: 'Point',
        coordinates: [0, 0],
      },
      address: extractPropertyValue(entity.address),
      temperature: extractPropertyValue(entity.temperature),
      feelsLikeTemperature: extractPropertyValue(entity.feelsLikeTemperature),
      relativeHumidity: extractPropertyValue(entity.relativeHumidity),
      atmosphericPressure: extractPropertyValue(entity.atmosphericPressure),
      windSpeed: extractPropertyValue(entity.windSpeed),
      windDirection: extractPropertyValue(entity.windDirection),
      precipitation: extractPropertyValue(entity.precipitation),
      weatherType: extractPropertyValue(entity.weatherType),
      weatherDescription: extractPropertyValue(entity.weatherDescription),
      visibility: extractPropertyValue(entity.visibility),
      uvIndex: extractPropertyValue(entity.uvIndex),
      source: extractPropertyValue(entity.dataProvider) || 'OpenWeatherMap',
    };
  }
}
