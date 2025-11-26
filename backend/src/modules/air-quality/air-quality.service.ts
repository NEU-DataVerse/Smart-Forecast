import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AirQualityObservedEntity } from '../persistence/entities/air-quality-observed.entity';
import { OrionClientProvider } from '../ingestion/providers/orion-client.provider';
import {
  AirQualityQueryDto,
  AirQualityDataResponse,
  AirQualityListResponse,
  CurrentAirQualityResponse,
  ForecastAirQualityResponse,
  DateRangeQueryDto,
} from './dto';

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
  ) {}

  /**
   * Get current air quality from Orion-LD (all active stations)
   */
  async getCurrentAirQuality(
    stationId?: string,
    city?: string,
  ): Promise<CurrentAirQualityResponse> {
    try {
      this.logger.log(
        `Fetching current air quality from Orion-LD (stationId: ${stationId}, city: ${city})`,
      );

      const queryOptions: any = {
        type: 'https://smartdatamodels.org/dataModel.Environment/AirQualityObserved',
        limit: 1000,
      };

      // Build query filter
      const qFilters: string[] = [];
      if (stationId) {
        qFilters.push(`locationId=="${stationId}"`);
      }
      // Note: For city filtering, we'd need to query by address property
      // This requires more complex NGSI-LD query syntax

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
        `Failed to fetch current air quality from Orion-LD: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get air quality forecast from Orion-LD (4-day hourly forecast)
   */
  async getForecastAirQuality(
    stationId?: string,
  ): Promise<ForecastAirQualityResponse> {
    try {
      this.logger.log(
        `Fetching air quality forecast from Orion-LD (stationId: ${stationId})`,
      );

      const queryOptions: any = {
        type: 'https://smartdatamodels.org/dataModel.Environment/AirQualityForecast',
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
    } catch (error) {
      this.logger.error(
        `Failed to fetch forecast air quality from Orion-LD: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get historical air quality data from PostgreSQL
   */
  async getHistoricalAirQuality(
    query: AirQualityQueryDto,
  ): Promise<AirQualityListResponse> {
    try {
      this.logger.log(
        `Fetching historical air quality from PostgreSQL: ${JSON.stringify(query)}`,
      );

      const page = query.page || 1;
      const limit = query.limit || 50;
      const skip = (page - 1) * limit;

      // Build where clause
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

      // Query with pagination
      const [entities, total] = await this.airQualityRepo.findAndCount({
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
      this.logger.error(
        `Failed to fetch historical air quality: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get air quality by specific station
   */
  async getByStation(stationId: string): Promise<AirQualityDataResponse> {
    try {
      this.logger.log(`Fetching air quality for station: ${stationId}`);

      // Try Orion-LD first for current data
      const current = await this.getCurrentAirQuality(stationId);

      if (current.data.length > 0) {
        return current.data[0];
      }

      // Fallback to latest from PostgreSQL
      const entity = await this.airQualityRepo.findOne({
        where: { locationId: stationId },
        order: { dateObserved: 'DESC' },
      });

      if (!entity) {
        throw new NotFoundException(
          `No air quality data found for station: ${stationId}`,
        );
      }

      return this.transformEntityToResponse(entity);
    } catch (error) {
      this.logger.error(
        `Failed to fetch air quality for station ${stationId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get AQI averages and components
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
    const queryBuilder = this.airQualityRepo
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
      queryBuilder.where('aqi.dateObserved BETWEEN :startDate AND :endDate', {
        startDate: new Date(query.startDate),
        endDate: new Date(query.endDate),
      });
    }

    const result = await queryBuilder.getRawOne();

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

  /**
   * Transform NGSI-LD entity to response format
   */
  private transformNGSILDToResponse(
    entity: any,
  ): AirQualityDataResponse & { validFrom?: string; validTo?: string } {
    const location = this.extractValue(
      this.getEntityAttribute(entity, 'location'),
    );
    const address = this.extractValue(
      this.getEntityAttribute(entity, 'address'),
    );

    // Check if this is a forecast entity (has validFrom/validTo)
    const validFrom = this.extractValue(
      this.getEntityAttribute(entity, 'validFrom'),
    );
    const validTo = this.extractValue(
      this.getEntityAttribute(entity, 'validTo'),
    );

    // Get EPA US AQI values
    const epaIndex = this.extractValue(
      this.getEntityAttribute(
        entity,
        'airQualityIndexUS',
        'dataModel.Environment',
      ),
    );
    const epaLevel = this.extractValue(
      this.getEntityAttribute(
        entity,
        'airQualityLevelUS',
        'dataModel.Environment',
      ),
    );

    const response: any = {
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
      pollutants: {
        co: this.extractValue(
          this.getEntityAttribute(entity, 'co', 'dataModel.Environment'),
        ),
        no: this.extractValue(
          this.getEntityAttribute(entity, 'no', 'dataModel.Environment'),
        ),
        no2: this.extractValue(
          this.getEntityAttribute(entity, 'no2', 'dataModel.Environment'),
        ),
        o3: this.extractValue(
          this.getEntityAttribute(entity, 'o3', 'dataModel.Environment'),
        ),
        so2: this.extractValue(
          this.getEntityAttribute(entity, 'so2', 'dataModel.Environment'),
        ),
        pm25: this.extractValue(
          this.getEntityAttribute(entity, 'pm25', 'dataModel.Environment'),
        ),
        pm10: this.extractValue(
          this.getEntityAttribute(entity, 'pm10', 'dataModel.Environment'),
        ),
        nh3: this.extractValue(this.getEntityAttribute(entity, 'nh3')),
      },
      aqi: {
        openWeather: {
          index:
            this.extractValue(
              this.getEntityAttribute(
                entity,
                'airQualityIndex',
                'dataModel.Environment',
              ),
            ) ?? 0,
          level:
            this.extractValue(
              this.getEntityAttribute(
                entity,
                'airQualityLevel',
                'dataModel.Environment',
              ),
            ) || 'Unknown',
        },
        epaUS: {
          // Only include EPA US if data exists, otherwise set defaults
          index: epaIndex !== null && epaIndex !== undefined ? epaIndex : null,
          level: epaLevel || null,
        },
      },
      // Include validFrom/validTo for forecast entities (will be undefined for current)
      validFrom:
        validFrom !== null && validFrom !== undefined ? validFrom : undefined,
      validTo: validTo !== null && validTo !== undefined ? validTo : undefined,
    };

    return response;
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
   * Handles both short names (e.g., 'co') and full URIs (e.g., 'https://smartdatamodels.org/dataModel.Environment/co')
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

    // Try with namespace if provided (e.g., dataModel.Environment)
    if (namespace) {
      const fullUri = `${baseUri}/${namespace}/${attributeName}`;
      if (fullUri in entity) {
        return entity[fullUri];
      }
    }

    // Try common namespace (dataModel.Environment) if not already tried
    if (namespace !== 'dataModel.Environment') {
      const envUri = `${baseUri}/dataModel.Environment/${attributeName}`;
      if (envUri in entity) {
        return entity[envUri];
      }
    }

    // Try base URI + attributeName (e.g., for validFrom, address)
    const baseUriWithAttr = `${baseUri}/${attributeName}`;
    if (baseUriWithAttr in entity) {
      return entity[baseUriWithAttr];
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
