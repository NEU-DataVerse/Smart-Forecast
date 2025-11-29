import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { WeatherObservedEntity } from '../persistence/entities/weather-observed.entity';
import { OrionClientProvider } from '../ingestion/providers/orion-client.provider';
import { StationService } from '../stations/station.service';
import {
  WeatherQueryDto,
  WeatherDataResponse,
  WeatherListResponse,
  CurrentWeatherResponse,
  ForecastWeatherResponse,
  NearbyWeatherResponse,
  CompareWeatherResponse,
  DateRangeQueryDto,
  NearbyIncludeType,
} from './dto';

// Constants
const NGSI_LD_BASE_URI = 'https://smartdatamodels.org';
const NGSI_LD_WEATHER_NAMESPACE = 'dataModel.Weather';
const WEATHER_OBSERVED_TYPE = `${NGSI_LD_BASE_URI}/${NGSI_LD_WEATHER_NAMESPACE}/WeatherObserved`;
const WEATHER_FORECAST_TYPE = `${NGSI_LD_BASE_URI}/${NGSI_LD_WEATHER_NAMESPACE}/WeatherForecast`;
const CACHE_TTL_MINUTES = 10;

/**
 * Weather Service
 * Handles querying weather data from PostgreSQL (history) and Orion-LD (current/forecast)
 */
@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(WeatherObservedEntity)
    private readonly weatherRepo: Repository<WeatherObservedEntity>,
    private readonly orionClient: OrionClientProvider,
    private readonly stationService: StationService,
  ) {}

  /**
   * Get current weather from Orion-LD
   */
  async getCurrentWeather(stationId?: string): Promise<CurrentWeatherResponse> {
    const queryOptions: Record<string, unknown> = {
      type: WEATHER_OBSERVED_TYPE,
      limit: 1000,
    };

    if (stationId) {
      queryOptions.q = `locationId=="${stationId}"`;
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
  }

  /**
   * Get weather forecast from Orion-LD (7-day daily)
   */
  async getForecastWeather(
    stationId?: string,
  ): Promise<ForecastWeatherResponse> {
    const queryOptions: Record<string, unknown> = {
      type: WEATHER_FORECAST_TYPE,
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
  }

  /**
   * Get historical weather data from PostgreSQL
   */
  async getHistoricalWeather(
    query: WeatherQueryDto,
  ): Promise<WeatherListResponse> {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

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

    return {
      data: entities.map((entity) => this.transformEntityToResponse(entity)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get weather by GPS coordinates (for mobile)
   */
  async getNearbyWeather(
    lat: number,
    lon: number,
    radius: number = 50,
    include: NearbyIncludeType = NearbyIncludeType.CURRENT,
  ): Promise<NearbyWeatherResponse> {
    const nearbyStations = await this.stationService.findNearest(
      lat,
      lon,
      radius,
      1,
    );

    if (nearbyStations.length === 0) {
      throw new NotFoundException(
        `No stations found within ${radius}km of coordinates (${lat}, ${lon})`,
      );
    }

    const nearestStation = nearbyStations[0];
    const stationId = nearestStation.id; // URN format for Orion-LD query

    const response: NearbyWeatherResponse = {
      nearestStation: {
        code: nearestStation.code,
        name: nearestStation.name,
        distance: Math.round(nearestStation.distance * 100) / 100,
      },
      source: 'orion-ld',
      timestamp: new Date().toISOString(),
      validUntil: new Date(
        Date.now() + CACHE_TTL_MINUTES * 60 * 1000,
      ).toISOString(),
    };

    // Fetch current data
    if (
      include === NearbyIncludeType.CURRENT ||
      include === NearbyIncludeType.BOTH
    ) {
      const currentData = await this.getCurrentWeather(stationId);
      if (currentData.data.length > 0) {
        response.current = currentData.data[0];
      }
    }

    // Fetch forecast data
    if (
      include === NearbyIncludeType.FORECAST ||
      include === NearbyIncludeType.BOTH
    ) {
      const forecastData = await this.getForecastWeather(stationId);
      response.forecast = forecastData.data;
    }

    return response;
  }

  /**
   * Compare weather across multiple stations (for admin dashboard)
   */
  async compareStations(
    stationCodes: string[],
  ): Promise<CompareWeatherResponse> {
    const stationDataPromises = stationCodes.map(async (stationCode) => {
      const station = await this.stationService
        .findByCode(stationCode)
        .catch(() => null);

      if (!station) {
        return { stationId: stationCode, stationName: undefined, data: null };
      }

      const result = await this.getCurrentWeather(station.id);
      return {
        stationId: stationCode,
        stationName: station.name,
        data: result.data[0] ?? null,
      };
    });

    return {
      stations: await Promise.all(stationDataPromises),
      source: 'orion-ld',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get weather trends (temperature, rainfall, humidity averages)
   */
  async getWeatherTrends(query: DateRangeQueryDto): Promise<{
    avgTemperature: number;
    avgRainfall: number;
    avgHumidity: number;
    dataPoints: number;
  }> {
    const qb = this.weatherRepo
      .createQueryBuilder('weather')
      .select('AVG(weather.temperature)', 'avgTemperature')
      .addSelect('AVG(weather.precipitation)', 'avgRainfall')
      .addSelect('AVG(weather.relativeHumidity)', 'avgHumidity')
      .addSelect('COUNT(*)', 'dataPoints');

    if (query.startDate && query.endDate) {
      qb.where('weather.dateObserved BETWEEN :startDate AND :endDate', {
        startDate: new Date(query.startDate),
        endDate: new Date(query.endDate),
      });
    }

    const result = await qb.getRawOne();

    return {
      avgTemperature: parseFloat(result.avgTemperature) || 0,
      avgRainfall: parseFloat(result.avgRainfall) || 0,
      avgHumidity: parseFloat(result.avgHumidity) || 0,
      dataPoints: parseInt(result.dataPoints) || 0,
    };
  }

  // ============ Private Helper Methods ============

  /**
   * Transform NGSI-LD entity to response format
   */
  private transformNGSILDToResponse(
    entity: Record<string, unknown>,
  ): WeatherDataResponse {
    const location = this.extractValue(this.getAttr(entity, 'location')) as {
      coordinates?: number[];
    };
    const address = this.extractValue(this.getAttr(entity, 'address'));

    return {
      id: entity.id as string,
      stationId:
        (this.extractValue(this.getAttr(entity, 'locationId')) as string) ||
        'unknown',
      location: {
        lat: location?.coordinates?.[1] || 0,
        lon: location?.coordinates?.[0] || 0,
      },
      address: this.formatAddress(address),
      dateObserved: this.extractValue(
        this.getAttr(entity, 'dateObserved'),
      ) as string,
      temperature: {
        current: this.extractValue(
          this.getAttr(entity, 'temperature', true),
        ) as number,
        feelsLike: this.extractValue(
          this.getAttr(entity, 'feelsLikeTemperature', true),
        ) as number,
        min: this.extractValue(
          this.getAttr(entity, 'temperatureMin'),
        ) as number,
        max: this.extractValue(
          this.getAttr(entity, 'temperatureMax'),
        ) as number,
      },
      atmospheric: {
        pressure: this.extractValue(
          this.getAttr(entity, 'atmosphericPressure', true),
        ) as number,
        humidity: this.extractValue(
          this.getAttr(entity, 'relativeHumidity', true),
        ) as number,
        seaLevelPressure: this.extractValue(
          this.getAttr(entity, 'pressureSeaLevel'),
        ) as number,
        groundLevelPressure: this.extractValue(
          this.getAttr(entity, 'pressureGroundLevel'),
        ) as number,
      },
      wind: {
        speed: this.extractValue(
          this.getAttr(entity, 'windSpeed', true),
        ) as number,
        direction: this.extractValue(
          this.getAttr(entity, 'windDirection', true),
        ) as number,
        gust: this.extractValue(this.getAttr(entity, 'windGust')) as number,
      },
      precipitation: this.extractValue(
        this.getAttr(entity, 'precipitation', true),
      ) as number,
      visibility: this.extractValue(
        this.getAttr(entity, 'visibility', true),
      ) as number,
      cloudiness: this.extractValue(
        this.getAttr(entity, 'cloudiness'),
      ) as number,
      weather: {
        type: this.extractValue(
          this.getAttr(entity, 'weatherType', true),
        ) as string,
        description: this.extractValue(
          this.getAttr(entity, 'weatherDescription'),
        ) as string,
        icon: this.extractValue(
          this.getAttr(entity, 'weatherIconCode'),
        ) as string,
      },
      sun: {
        sunrise: this.extractValue(this.getAttr(entity, 'sunrise')) as string,
        sunset: this.extractValue(this.getAttr(entity, 'sunset')) as string,
      },
      timezone: this.extractValue(this.getAttr(entity, 'timezone')) as number,
    };
  }

  /**
   * Transform NGSI-LD WeatherForecast entity to response format
   */
  private transformForecastToResponse(
    entity: Record<string, unknown>,
  ): WeatherDataResponse & { validFrom: string; validTo: string } {
    const location = this.extractValue(this.getAttr(entity, 'location')) as {
      coordinates?: number[];
    };
    const address = this.extractValue(this.getAttr(entity, 'address'));

    // Extract dayMinimum and dayMaximum for temperature ranges
    const dayMin = this.extractValue(
      this.getAttr(entity, 'dayMinimum', true),
    ) as { temperature?: number };
    const dayMax = this.extractValue(
      this.getAttr(entity, 'dayMaximum', true),
    ) as { temperature?: number };

    return {
      id: entity.id as string,
      stationId:
        (this.extractValue(this.getAttr(entity, 'locationId')) as string) ||
        'unknown',
      location: {
        lat: location?.coordinates?.[1] || 0,
        lon: location?.coordinates?.[0] || 0,
      },
      address: this.formatAddress(address),
      dateObserved: this.extractValue(
        this.getAttr(entity, 'dateIssued', true),
      ) as string,
      temperature: {
        current: this.extractValue(
          this.getAttr(entity, 'temperature', true),
        ) as number,
        feelsLike: this.extractValue(
          this.getAttr(entity, 'feelsLikeTemperature', true),
        ) as number,
        min: dayMin?.temperature ?? undefined,
        max: dayMax?.temperature ?? undefined,
      },
      atmospheric: {
        pressure: this.extractValue(
          this.getAttr(entity, 'atmosphericPressure', true),
        ) as number,
        humidity: this.extractValue(
          this.getAttr(entity, 'relativeHumidity', true),
        ) as number,
        seaLevelPressure: undefined,
        groundLevelPressure: undefined,
      },
      wind: {
        speed: this.extractValue(
          this.getAttr(entity, 'windSpeed', true),
        ) as number,
        direction: this.extractValue(
          this.getAttr(entity, 'windDirection', true),
        ) as number,
        gust: this.extractValue(this.getAttr(entity, 'windGust')) as number,
      },
      precipitation: this.extractValue(
        this.getAttr(entity, 'precipitationProbability', true),
      ) as number,
      visibility: undefined,
      cloudiness: this.extractValue(
        this.getAttr(entity, 'cloudiness'),
      ) as number,
      weather: {
        type: this.extractValue(
          this.getAttr(entity, 'weatherType', true),
        ) as string,
        description: this.extractValue(
          this.getAttr(entity, 'weatherDescription'),
        ) as string,
        icon: this.extractValue(
          this.getAttr(entity, 'weatherIcon', true),
        ) as string,
      },
      sun: {
        sunrise: this.extractValue(
          this.getAttr(entity, 'sunrise', true),
        ) as string,
        sunset: this.extractValue(
          this.getAttr(entity, 'sunset', true),
        ) as string,
      },
      timezone: undefined,
      validFrom: this.extractValue(this.getAttr(entity, 'validFrom')) as string,
      validTo: this.extractValue(
        this.getAttr(entity, 'validTo', true),
      ) as string,
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
   */
  private getAttr(
    entity: Record<string, unknown>,
    name: string,
    useWeatherNamespace = false,
  ): unknown {
    // Try short name first
    if (name in entity) return entity[name];

    // Try with Weather namespace
    if (useWeatherNamespace) {
      const weatherUri = `${NGSI_LD_BASE_URI}/${NGSI_LD_WEATHER_NAMESPACE}/${name}`;
      if (weatherUri in entity) return entity[weatherUri];
    }

    // Try base URI
    const baseUri = `${NGSI_LD_BASE_URI}/${name}`;
    if (baseUri in entity) return entity[baseUri];

    return null;
  }

  /**
   * Extract value from NGSI-LD Property/Relationship
   */
  private extractValue(attribute: unknown): unknown {
    if (attribute == null) return null;
    if (typeof attribute !== 'object') return attribute;

    const obj = attribute as Record<string, unknown>;
    return obj.value ?? obj.object ?? attribute;
  }

  /**
   * Format address to readable string
   */
  private formatAddress(address: unknown): string | undefined {
    if (!address) return undefined;

    if (typeof address === 'string') return address;

    if (typeof address === 'object') {
      const addr = address as Record<string, string>;
      if (addr.addressLocality && addr.addressCountry) {
        return `${addr.addressLocality}, ${addr.addressCountry}`;
      }
      return addr.addressLocality;
    }

    return undefined;
  }
}
