import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { WeatherObservedEntity } from '../persistence/entities/weather-observed.entity';
import { OrionClientProvider } from '../ingestion/providers/orion-client.provider';
import {
  WeatherQueryDto,
  WeatherDataResponse,
  WeatherListResponse,
  CurrentWeatherResponse,
  ForecastWeatherResponse,
} from './dto';

/**
 * Weather Service
 * Handles querying weather data from PostgreSQL (history) and Orion-LD (current/forecast)
 */
@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    @InjectRepository(WeatherObservedEntity)
    private readonly weatherRepo: Repository<WeatherObservedEntity>,
    private readonly orionClient: OrionClientProvider,
  ) {}

  /**
   * Get current weather from Orion-LD (all active stations)
   */
  async getCurrentWeather(
    stationId?: string,
    city?: string,
  ): Promise<CurrentWeatherResponse> {
    try {
      this.logger.log(
        `Fetching current weather from Orion-LD (stationId: ${stationId}, city: ${city})`,
      );

      const queryOptions: any = {
        type: 'https://smartdatamodels.org/dataModel.Weather/WeatherObserved',
        limit: 1000,
      };

      const qFilters: string[] = [];
      if (stationId) {
        qFilters.push(`locationId=="${stationId}"`);
      }

      if (qFilters.length > 0) {
        queryOptions.q = qFilters.join(';');
      }

      const entities = await this.orionClient.queryEntities(queryOptions);

      const data = entities.map((entity) =>
        this.transformNGSILDToResponse(entity),
      );

      return {
        data,
        source: 'orion-ld',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch current weather from Orion-LD: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get weather forecast from Orion-LD (7-day daily forecast)
   */
  async getForecastWeather(
    stationId?: string,
  ): Promise<ForecastWeatherResponse> {
    try {
      this.logger.log(
        `Fetching weather forecast from Orion-LD (stationId: ${stationId})`,
      );

      const queryOptions: any = {
        type: 'https://smartdatamodels.org/dataModel.Weather/WeatherForecast',
        limit: 1000,
      };

      if (stationId) {
        queryOptions.q = `locationId=="${stationId}"`;
      }

      const entities = await this.orionClient.queryEntities(queryOptions);

      const data = entities.map((entity) =>
        this.transformForecastToResponse(entity),
      );

      return {
        data,
        source: 'orion-ld',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch forecast weather from Orion-LD: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get historical weather data from PostgreSQL
   */
  async getHistoricalWeather(
    query: WeatherQueryDto,
  ): Promise<WeatherListResponse> {
    try {
      this.logger.log(
        `Fetching historical weather from PostgreSQL: ${JSON.stringify(query)}`,
      );

      const page = query.page || 1;
      const limit = query.limit || 50;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (query.stationId) {
        where.locationId = query.stationId;
      }

      if (query.startDate && query.endDate) {
        where.dateObserved = Between(
          new Date(query.startDate),
          new Date(query.endDate),
        );
      } else if (query.startDate) {
        where.dateObserved = MoreThanOrEqual(new Date(query.startDate));
      } else if (query.endDate) {
        where.dateObserved = LessThanOrEqual(new Date(query.endDate));
      }

      const [entities, total] = await this.weatherRepo.findAndCount({
        where,
        order: { dateObserved: 'DESC' },
        skip,
        take: limit,
      });

      const data = entities.map((entity) =>
        this.transformEntityToResponse(entity),
      );

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to fetch historical weather: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get weather by specific station
   */
  async getByStation(stationId: string): Promise<WeatherDataResponse> {
    try {
      this.logger.log(`Fetching weather for station: ${stationId}`);

      const current = await this.getCurrentWeather(stationId);

      if (current.data.length > 0) {
        return current.data[0];
      }

      const entity = await this.weatherRepo.findOne({
        where: { locationId: stationId },
        order: { dateObserved: 'DESC' },
      });

      if (!entity) {
        throw new NotFoundException(
          `No weather data found for station: ${stationId}`,
        );
      }

      return this.transformEntityToResponse(entity);
    } catch (error) {
      this.logger.error(
        `Failed to fetch weather for station ${stationId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Transform NGSI-LD entity to response format
   */
  private transformNGSILDToResponse(entity: any): WeatherDataResponse {
    const location = this.extractValue(
      this.getEntityAttribute(entity, 'location'),
    );
    const address = this.extractValue(
      this.getEntityAttribute(entity, 'address'),
    );

    return {
      id: entity.id,
      stationId:
        this.extractValue(this.getEntityAttribute(entity, 'locationId')) ||
        'unknown',
      location: {
        lat: location?.coordinates?.[1] || 0,
        lon: location?.coordinates?.[0] || 0,
      },
      address: this.formatAddress(address),
      dateObserved: this.extractValue(
        this.getEntityAttribute(entity, 'dateObserved'),
      ),
      temperature: {
        current: this.extractValue(
          this.getEntityAttribute(entity, 'temperature', 'dataModel.Weather'),
        ),
        feelsLike: this.extractValue(
          this.getEntityAttribute(
            entity,
            'feelsLikeTemperature',
            'dataModel.Weather',
          ),
        ),
        min: this.extractValue(
          this.getEntityAttribute(entity, 'temperatureMin'),
        ),
        max: this.extractValue(
          this.getEntityAttribute(entity, 'temperatureMax'),
        ),
      },
      atmospheric: {
        pressure: this.extractValue(
          this.getEntityAttribute(
            entity,
            'atmosphericPressure',
            'dataModel.Weather',
          ),
        ),
        humidity: this.extractValue(
          this.getEntityAttribute(
            entity,
            'relativeHumidity',
            'dataModel.Weather',
          ),
        ),
        seaLevelPressure: this.extractValue(
          this.getEntityAttribute(entity, 'pressureSeaLevel'),
        ),
        groundLevelPressure: this.extractValue(
          this.getEntityAttribute(entity, 'pressureGroundLevel'),
        ),
      },
      wind: {
        speed: this.extractValue(
          this.getEntityAttribute(entity, 'windSpeed', 'dataModel.Weather'),
        ),
        direction: this.extractValue(
          this.getEntityAttribute(entity, 'windDirection', 'dataModel.Weather'),
        ),
        gust: this.extractValue(this.getEntityAttribute(entity, 'windGust')),
      },
      precipitation: this.extractValue(
        this.getEntityAttribute(entity, 'precipitation', 'dataModel.Weather'),
      ),
      visibility: this.extractValue(
        this.getEntityAttribute(entity, 'visibility', 'dataModel.Weather'),
      ),
      cloudiness: this.extractValue(
        this.getEntityAttribute(entity, 'cloudiness'),
      ),
      weather: {
        type: this.extractValue(
          this.getEntityAttribute(entity, 'weatherType', 'dataModel.Weather'),
        ),
        description: this.extractValue(
          this.getEntityAttribute(entity, 'weatherDescription'),
        ),
        icon: this.extractValue(
          this.getEntityAttribute(entity, 'weatherIconCode'),
        ),
      },
      sun: {
        sunrise: this.extractValue(this.getEntityAttribute(entity, 'sunrise')),
        sunset: this.extractValue(this.getEntityAttribute(entity, 'sunset')),
      },
      timezone: this.extractValue(this.getEntityAttribute(entity, 'timezone')),
    };
  }

  /**
   * Transform NGSI-LD WeatherForecast entity to response format
   * Forecasts have different structure than observed data
   */
  private transformForecastToResponse(entity: any): any {
    const location = this.extractValue(
      this.getEntityAttribute(entity, 'location'),
    );
    const address = this.extractValue(
      this.getEntityAttribute(entity, 'address'),
    );

    // Extract dayMinimum and dayMaximum for temperature ranges
    const dayMin = this.extractValue(
      this.getEntityAttribute(entity, 'dayMinimum', 'dataModel.Weather'),
    );
    const dayMax = this.extractValue(
      this.getEntityAttribute(entity, 'dayMaximum', 'dataModel.Weather'),
    );

    return {
      id: entity.id,
      stationId:
        this.extractValue(this.getEntityAttribute(entity, 'locationId')) ||
        'unknown',
      location: {
        lat: location?.coordinates?.[1] || 0,
        lon: location?.coordinates?.[0] || 0,
      },
      address: this.formatAddress(address),
      dateObserved: this.extractValue(
        this.getEntityAttribute(entity, 'dateIssued', 'dataModel.Weather'),
      ),
      temperature: {
        current: this.extractValue(
          this.getEntityAttribute(entity, 'temperature', 'dataModel.Weather'),
        ),
        feelsLike: this.extractValue(
          this.getEntityAttribute(
            entity,
            'feelsLikeTemperature',
            'dataModel.Weather',
          ),
        ),
        min: dayMin?.temperature ?? null,
        max: dayMax?.temperature ?? null,
      },
      atmospheric: {
        pressure: this.extractValue(
          this.getEntityAttribute(
            entity,
            'atmosphericPressure',
            'dataModel.Weather',
          ),
        ),
        humidity: this.extractValue(
          this.getEntityAttribute(
            entity,
            'relativeHumidity',
            'dataModel.Weather',
          ),
        ),
        seaLevelPressure: null, // Not available in forecast
        groundLevelPressure: null, // Not available in forecast
      },
      wind: {
        speed: this.extractValue(
          this.getEntityAttribute(entity, 'windSpeed', 'dataModel.Weather'),
        ),
        direction: this.extractValue(
          this.getEntityAttribute(entity, 'windDirection', 'dataModel.Weather'),
        ),
        gust: this.extractValue(this.getEntityAttribute(entity, 'windGust')),
      },
      precipitation: this.extractValue(
        this.getEntityAttribute(
          entity,
          'precipitationProbability',
          'dataModel.Weather',
        ),
      ),
      visibility: null, // Not available in forecast
      cloudiness: this.extractValue(
        this.getEntityAttribute(entity, 'cloudiness'),
      ),
      weather: {
        type: this.extractValue(
          this.getEntityAttribute(entity, 'weatherType', 'dataModel.Weather'),
        ),
        description: this.extractValue(
          this.getEntityAttribute(entity, 'weatherDescription'),
        ),
        icon: this.extractValue(
          this.getEntityAttribute(entity, 'weatherIcon', 'dataModel.Weather'),
        ),
      },
      sun: {
        sunrise: this.extractValue(
          this.getEntityAttribute(entity, 'sunrise', 'dataModel.Weather'),
        ),
        sunset: this.extractValue(
          this.getEntityAttribute(entity, 'sunset', 'dataModel.Weather'),
        ),
      },
      timezone: null, // Not available in forecast
      validFrom: this.extractValue(
        this.getEntityAttribute(entity, 'validFrom'),
      ),
      validTo: this.extractValue(
        this.getEntityAttribute(entity, 'validTo', 'dataModel.Weather'),
      ),
    };
  }

  /**
   * Transform PostgreSQL entity to response format
   */
  private transformEntityToResponse(
    entity: WeatherObservedEntity,
  ): WeatherDataResponse {
    return {
      id: entity.entityId,
      stationId: entity.locationId || 'unknown',
      location: {
        lat: entity.location?.coordinates?.[1] || 0,
        lon: entity.location?.coordinates?.[0] || 0,
      },
      address: this.formatAddress(entity.address),
      dateObserved: entity.dateObserved.toISOString(),
      temperature: {
        current: entity.temperature ?? undefined,
        feelsLike: entity.feelsLikeTemperature ?? undefined,
        min: entity.temperatureMin ?? undefined,
        max: entity.temperatureMax ?? undefined,
      },
      atmospheric: {
        pressure: entity.atmosphericPressure ?? undefined,
        humidity: entity.relativeHumidity ?? undefined,
        seaLevelPressure: entity.pressureSeaLevel ?? undefined,
        groundLevelPressure: entity.pressureGroundLevel ?? undefined,
      },
      wind: {
        speed: entity.windSpeed ?? undefined,
        direction: entity.windDirection ?? undefined,
        gust: entity.windGust ?? undefined,
      },
      precipitation: entity.precipitation ?? undefined,
      visibility: entity.visibility ?? undefined,
      cloudiness: entity.cloudiness ?? undefined,
      weather: {
        type: entity.weatherType ?? undefined,
        description: entity.weatherDescription,
        icon: entity.weatherIconCode,
      },
      sun: {
        sunrise: entity.sunrise?.toISOString(),
        sunset: entity.sunset?.toISOString(),
      },
      timezone: entity.timezone ?? undefined,
    };
  }

  /**
   * Get entity attribute with fallback for full NGSI-LD URIs
   * Handles both short names (e.g., 'temperature') and full URIs (e.g., 'https://smartdatamodels.org/temperature')
   */
  private getEntityAttribute(
    entity: any,
    attributeName: string,
    namespace?: string,
  ): any {
    // Try short name first (use 'in' to handle falsy values like 0)
    if (attributeName in entity) {
      return entity[attributeName];
    }

    // Try with smartdatamodels.org base URI
    const baseUri = 'https://smartdatamodels.org';

    // Try with namespace if provided
    if (namespace) {
      const fullUri = `${baseUri}/${namespace}/${attributeName}`;
      if (fullUri in entity) {
        return entity[fullUri];
      }
    }

    // Try without namespace (e.g., for common attributes like dateObserved, address)
    const commonUri = `${baseUri}/${attributeName}`;
    if (commonUri in entity) {
      return entity[commonUri];
    }

    return null;
  }

  /**
   * Extract value from NGSI-LD Property/Relationship
   * Properly handles falsy values like 0, false, empty strings
   */
  private extractValue(attribute: any): any {
    // Check for null/undefined explicitly
    if (attribute === null || attribute === undefined) return null;

    // If it's a primitive type, return as-is (including 0, false, '')
    if (
      typeof attribute === 'string' ||
      typeof attribute === 'number' ||
      typeof attribute === 'boolean'
    )
      return attribute;

    // Extract from NGSI-LD structure (check with !== undefined to allow 0, false, '')
    if (attribute.value !== undefined) return attribute.value;
    if (attribute.object !== undefined) return attribute.object;

    return attribute;
  }

  /**
   * Format address to readable string or object
   */
  private formatAddress(address: any): string | undefined {
    if (!address) return undefined;

    // If it's a string, try to parse as JSON
    if (typeof address === 'string') {
      try {
        const parsed = JSON.parse(address);
        // Return formatted string from parsed object
        if (parsed.addressLocality && parsed.addressCountry) {
          return `${parsed.addressLocality}, ${parsed.addressCountry}`;
        }
        return parsed.addressLocality || address;
      } catch {
        // Not JSON, return as-is
        return address;
      }
    }

    // If it's already an object
    if (typeof address === 'object') {
      if (address.addressLocality && address.addressCountry) {
        return `${address.addressLocality}, ${address.addressCountry}`;
      }
      return address.addressLocality || undefined;
    }

    return undefined;
  }
}
