import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AirQualityObservedEntity } from '../persistence/entities/air-quality-observed.entity';
import { OrionClientProvider } from '../ingestion/providers/orion-client.provider';
import { StationService } from '../stations/station.service';
import {
  AirQualityQueryDto,
  AQAggregationInterval,
  AirQualityDataResponse,
  AirQualityListResponse,
  CurrentAirQualityResponse,
  ForecastAirQualityResponse,
  NearbyAirQualityResponse,
  CompareAirQualityResponse,
  DateRangeQueryDto,
  NearbyIncludeType,
} from './dto';

// Constants
const NGSI_LD_BASE_URI = 'https://smartdatamodels.org';
const NGSI_LD_ENV_NAMESPACE = 'dataModel.Environment';
const AQ_OBSERVED_TYPE = `${NGSI_LD_BASE_URI}/${NGSI_LD_ENV_NAMESPACE}/AirQualityObserved`;
const AQ_FORECAST_TYPE = `${NGSI_LD_BASE_URI}/${NGSI_LD_ENV_NAMESPACE}/AirQualityForecast`;
const CACHE_TTL_MINUTES = 10;

/**
 * Air Quality Service
 * Handles querying air quality data from PostgreSQL (history) and Orion-LD (current/forecast)
 */
@Injectable()
export class AirQualityService {
  private readonly logger = new Logger(AirQualityService.name);

  constructor(
    @InjectRepository(AirQualityObservedEntity)
    private readonly airQualityRepo: Repository<AirQualityObservedEntity>,
    private readonly orionClient: OrionClientProvider,
    private readonly stationService: StationService,
  ) {}

  /**
   * Get current air quality from Orion-LD
   */
  async getCurrentAirQuality(
    stationId?: string,
  ): Promise<CurrentAirQualityResponse> {
    const queryOptions: Record<string, unknown> = {
      type: AQ_OBSERVED_TYPE,
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
   * Get air quality forecast from Orion-LD (4-day hourly)
   */
  async getForecastAirQuality(
    stationId?: string,
  ): Promise<ForecastAirQualityResponse> {
    const queryOptions: Record<string, unknown> = {
      type: AQ_FORECAST_TYPE,
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
   * Get historical air quality data from PostgreSQL
   * Supports time-based aggregation (hourly, 6h, daily)
   */
  async getHistoricalAirQuality(
    query: AirQualityQueryDto,
  ): Promise<AirQualityListResponse> {
    const interval = query.interval || 'raw';

    // Use aggregation for non-raw intervals
    if (interval !== 'raw') {
      return this.getHistoricalAirQualityAggregated(query, interval);
    }

    return this.getHistoricalAirQualityRaw(query);
  }

  /**
   * Get raw historical air quality data (no aggregation)
   */
  private async getHistoricalAirQualityRaw(
    query: AirQualityQueryDto,
  ): Promise<AirQualityListResponse> {
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

    const [entities, total] = await this.airQualityRepo.findAndCount({
      where,
      order: { dateObserved: 'ASC' },
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
   * Get aggregated historical air quality data
   */
  private async getHistoricalAirQualityAggregated(
    query: AirQualityQueryDto,
    interval: AQAggregationInterval,
  ): Promise<AirQualityListResponse> {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const periodExpr = this.getPeriodExpression(interval);

    // Build aggregation query
    const qb = this.airQualityRepo
      .createQueryBuilder('aqi')
      .select(periodExpr, 'period')
      .addSelect('AVG(aqi.airQualityIndexUS)', 'avgAQI')
      .addSelect('AVG(aqi.pm25)', 'avgPM25')
      .addSelect('AVG(aqi.pm10)', 'avgPM10')
      .addSelect('AVG(aqi.co)', 'avgCO')
      .addSelect('AVG(aqi.no)', 'avgNO')
      .addSelect('AVG(aqi.no2)', 'avgNO2')
      .addSelect('AVG(aqi.so2)', 'avgSO2')
      .addSelect('AVG(aqi.o3)', 'avgO3')
      .addSelect('AVG(aqi.nh3)', 'avgNH3')
      .addSelect('MIN(aqi.locationId)', 'locationId')
      .addSelect('COUNT(*)', 'dataPointCount')
      .groupBy('period')
      .orderBy('period', 'ASC')
      .offset(skip)
      .limit(limit);

    // Apply filters
    if (query.stationId) {
      qb.andWhere('aqi.locationId = :stationId', {
        stationId: query.stationId,
      });
    }

    if (query.startDate && query.endDate) {
      qb.andWhere('aqi.dateObserved BETWEEN :startDate AND :endDate', {
        startDate: new Date(query.startDate),
        endDate: new Date(query.endDate),
      });
    } else if (query.startDate) {
      qb.andWhere('aqi.dateObserved >= :startDate', {
        startDate: new Date(query.startDate),
      });
    } else if (query.endDate) {
      qb.andWhere('aqi.dateObserved <= :endDate', {
        endDate: new Date(query.endDate),
      });
    }

    // Get total count for pagination
    const periodExprForCount = this.getPeriodExpression(interval);
    const countQb = this.airQualityRepo
      .createQueryBuilder('aqi')
      .select(`COUNT(DISTINCT ${periodExprForCount})`, 'count');

    if (query.stationId) {
      countQb.andWhere('aqi.locationId = :stationId', {
        stationId: query.stationId,
      });
    }

    if (query.startDate && query.endDate) {
      countQb.andWhere('aqi.dateObserved BETWEEN :startDate AND :endDate', {
        startDate: new Date(query.startDate),
        endDate: new Date(query.endDate),
      });
    }

    const countResult = await countQb.getRawOne();
    const total = parseInt(countResult?.count || '0');

    const aggregatedData = await qb.getRawMany();

    return {
      data: aggregatedData.map((row) =>
        this.transformAggregatedToResponse(row),
      ),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get SQL period expression based on aggregation interval
   */
  private getPeriodExpression(interval: AQAggregationInterval): string {
    switch (interval) {
      case 'hourly':
        return `DATE_TRUNC('hour', aqi.dateObserved)`;
      case '6h':
        // Round to 6-hour periods: 00:00, 06:00, 12:00, 18:00
        return `DATE_TRUNC('day', aqi.dateObserved) + INTERVAL '6 hours' * FLOOR(EXTRACT(HOUR FROM aqi.dateObserved) / 6)`;
      case 'daily':
        return `DATE_TRUNC('day', aqi.dateObserved)`;
      default:
        return `DATE_TRUNC('hour', aqi.dateObserved)`;
    }
  }

  /**
   * Transform aggregated row to response format
   */
  private transformAggregatedToResponse(row: {
    period: Date;
    avgAQI: string | null;
    avgPM25: string | null;
    avgPM10: string | null;
    avgCO: string | null;
    avgNO: string | null;
    avgNO2: string | null;
    avgSO2: string | null;
    avgO3: string | null;
    avgNH3: string | null;
    locationId: string | null;
    dataPointCount: string;
  }): AirQualityDataResponse {
    return {
      id: `aggregated-${row.period.toISOString()}`,
      stationId: row.locationId || 'unknown',
      location: { lat: 0, lon: 0 },
      dateObserved: row.period.toISOString(),
      pollutants: {
        co: row.avgCO ? parseFloat(row.avgCO) : undefined,
        no: row.avgNO ? parseFloat(row.avgNO) : undefined,
        no2: row.avgNO2 ? parseFloat(row.avgNO2) : undefined,
        o3: row.avgO3 ? parseFloat(row.avgO3) : undefined,
        so2: row.avgSO2 ? parseFloat(row.avgSO2) : undefined,
        pm25: row.avgPM25 ? parseFloat(row.avgPM25) : undefined,
        pm10: row.avgPM10 ? parseFloat(row.avgPM10) : undefined,
        nh3: row.avgNH3 ? parseFloat(row.avgNH3) : undefined,
      },
      aqi: {
        openWeather: {
          index: 0,
          level: 'Unknown',
        },
        epaUS: {
          index: row.avgAQI ? Math.round(parseFloat(row.avgAQI)) : 0,
          level: this.getAQILevel(
            row.avgAQI ? Math.round(parseFloat(row.avgAQI)) : 0,
          ),
        },
      },
    };
  }

  /**
   * Get AQI level description based on EPA US scale
   */
  private getAQILevel(aqi: number): string {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }

  /**
   * Get air quality by GPS coordinates (for mobile)
   */
  async getNearbyAirQuality(
    lat: number,
    lon: number,
    radius: number = 50,
    include: NearbyIncludeType = NearbyIncludeType.CURRENT,
  ): Promise<NearbyAirQualityResponse> {
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

    const response: NearbyAirQualityResponse = {
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
      const currentData = await this.getCurrentAirQuality(stationId);
      if (currentData.data.length > 0) {
        response.current = currentData.data[0];
      }
    }

    // Fetch forecast data
    if (
      include === NearbyIncludeType.FORECAST ||
      include === NearbyIncludeType.BOTH
    ) {
      const forecastData = await this.getForecastAirQuality(stationId);
      response.forecast = forecastData.data;
    }

    return response;
  }

  /**
   * Compare air quality across multiple stations (for admin dashboard)
   */
  async compareStations(
    stationCodes: string[],
  ): Promise<CompareAirQualityResponse> {
    const stationDataPromises = stationCodes.map(async (stationCode) => {
      const station = await this.stationService
        .findByCode(stationCode)
        .catch(() => null);

      if (!station) {
        return { stationId: stationCode, stationName: undefined, data: null };
      }

      const result = await this.getCurrentAirQuality(station.id);
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
   * Get AQI averages and pollutant statistics
   */
  async getAQIAverages(query: DateRangeQueryDto): Promise<{
    avgAQI: number;
    avgPM25: number;
    avgPM10: number;
    avgCO: number;
    avgNO2: number;
    avgSO2: number;
    avgO3: number;
    dataPoints: number;
  }> {
    const qb = this.airQualityRepo
      .createQueryBuilder('aqi')
      .select('AVG(aqi.airQualityIndex)', 'avgAQI')
      .addSelect('AVG(aqi.pm25)', 'avgPM25')
      .addSelect('AVG(aqi.pm10)', 'avgPM10')
      .addSelect('AVG(aqi.co)', 'avgCO')
      .addSelect('AVG(aqi.no2)', 'avgNO2')
      .addSelect('AVG(aqi.so2)', 'avgSO2')
      .addSelect('AVG(aqi.o3)', 'avgO3')
      .addSelect('COUNT(*)', 'dataPoints');

    if (query.startDate && query.endDate) {
      qb.where('aqi.dateObserved BETWEEN :startDate AND :endDate', {
        startDate: new Date(query.startDate),
        endDate: new Date(query.endDate),
      });
    }

    const result = await qb.getRawOne();

    return {
      avgAQI: parseFloat(result.avgAQI) || 0,
      avgPM25: parseFloat(result.avgPM25) || 0,
      avgPM10: parseFloat(result.avgPM10) || 0,
      avgCO: parseFloat(result.avgCO) || 0,
      avgNO2: parseFloat(result.avgNO2) || 0,
      avgSO2: parseFloat(result.avgSO2) || 0,
      avgO3: parseFloat(result.avgO3) || 0,
      dataPoints: parseInt(result.dataPoints) || 0,
    };
  }

  // ============ Private Helper Methods ============

  /**
   * Transform NGSI-LD entity to response format
   */
  private transformNGSILDToResponse(
    entity: Record<string, unknown>,
  ): AirQualityDataResponse & { validFrom?: string; validTo?: string } {
    const location = this.extractValue(this.getAttr(entity, 'location')) as {
      coordinates?: number[];
    };
    const address = this.extractValue(this.getAttr(entity, 'address'));
    const validFrom = this.extractValue(
      this.getAttr(entity, 'validFrom'),
    ) as string;
    const validTo = this.extractValue(
      this.getAttr(entity, 'validTo'),
    ) as string;

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
      pollutants: {
        co: this.extractValue(this.getAttr(entity, 'co', true)) as number,
        no: this.extractValue(this.getAttr(entity, 'no', true)) as number,
        no2: this.extractValue(this.getAttr(entity, 'no2', true)) as number,
        o3: this.extractValue(this.getAttr(entity, 'o3', true)) as number,
        so2: this.extractValue(this.getAttr(entity, 'so2', true)) as number,
        pm25: this.extractValue(this.getAttr(entity, 'pm25', true)) as number,
        pm10: this.extractValue(this.getAttr(entity, 'pm10', true)) as number,
        nh3: this.extractValue(this.getAttr(entity, 'nh3')) as number,
      },
      aqi: {
        openWeather: {
          index:
            (this.extractValue(
              this.getAttr(entity, 'airQualityIndex', true),
            ) as number) ?? 0,
          level:
            (this.extractValue(
              this.getAttr(entity, 'airQualityLevel', true),
            ) as string) || 'Unknown',
        },
        epaUS: {
          index: this.extractValue(
            this.getAttr(entity, 'airQualityIndexUS', true),
          ) as number,
          level: this.extractValue(
            this.getAttr(entity, 'airQualityLevelUS', true),
          ) as string,
        },
      },
      ...(validFrom != null && { validFrom }),
      ...(validTo != null && { validTo }),
    };
  }

  /**
   * Transform PostgreSQL entity to response format
   */
  private transformEntityToResponse(
    entity: AirQualityObservedEntity,
  ): AirQualityDataResponse {
    return {
      id: entity.entityId,
      stationId: entity.locationId || 'unknown',
      location: {
        lat: entity.location?.coordinates?.[1] || 0,
        lon: entity.location?.coordinates?.[0] || 0,
      },
      address: this.formatAddress(entity.address),
      dateObserved: entity.dateObserved.toISOString(),
      pollutants: {
        co: entity.co ?? undefined,
        no: entity.no ?? undefined,
        no2: entity.no2 ?? undefined,
        o3: entity.o3 ?? undefined,
        so2: entity.so2 ?? undefined,
        pm25: entity.pm25 ?? undefined,
        pm10: entity.pm10 ?? undefined,
        nh3: entity.nh3 ?? undefined,
      },
      aqi: {
        openWeather: {
          index: entity.airQualityIndex || 0,
          level: entity.airQualityLevel || 'Unknown',
        },
        epaUS: {
          index: entity.airQualityIndexUS || 0,
          level: entity.airQualityLevelUS || 'Unknown',
        },
      },
    };
  }

  /**
   * Get entity attribute with fallback for full NGSI-LD URIs
   */
  private getAttr(
    entity: Record<string, unknown>,
    name: string,
    useEnvNamespace = false,
  ): unknown {
    // Try short name first
    if (name in entity) return entity[name];

    // Try with Environment namespace
    if (useEnvNamespace) {
      const envUri = `${NGSI_LD_BASE_URI}/${NGSI_LD_ENV_NAMESPACE}/${name}`;
      if (envUri in entity) return entity[envUri];
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
