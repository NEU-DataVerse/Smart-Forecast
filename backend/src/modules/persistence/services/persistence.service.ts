import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirQualityObservedEntity } from '../entities/air-quality-observed.entity';
import { WeatherObservedEntity } from '../entities/weather-observed.entity';

/**
 * Persistence Service
 *
 * Handles parsing and persistence of NGSI-LD entities to PostgreSQL
 */
@Injectable()
export class PersistenceService {
  private readonly logger = new Logger(PersistenceService.name);

  constructor(
    @InjectRepository(AirQualityObservedEntity)
    private readonly airQualityRepo: Repository<AirQualityObservedEntity>,
    @InjectRepository(WeatherObservedEntity)
    private readonly weatherRepo: Repository<WeatherObservedEntity>,
  ) {}

  /**
   * Persist multiple NGSI-LD entities
   */
  async persistEntities(
    entities: any[],
    notifiedAt: string,
  ): Promise<{
    success: number;
    failed: number;
    errors: string[];
  }> {
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    this.logger.debug(
      `Received ${entities.length} entities to persist at ${notifiedAt}`,
    );

    for (const entity of entities) {
      try {
        this.logger.debug(
          `Processing entity: ${entity.id}, type: ${entity.type}`,
        );
        await this.persistEntity(entity, notifiedAt);
        success++;
      } catch (error) {
        failed++;
        errors.push(`${entity.id}: ${error.message}`);
        this.logger.error(`Failed to persist entity ${entity.id}`, error.stack);
      }
    }

    return { success, failed, errors };
  }

  /**
   * Persist single NGSI-LD entity based on type
   */
  private async persistEntity(entity: any, notifiedAt: string): Promise<void> {
    const entityType = this.extractEntityType(entity.type);

    this.logger.debug(
      `Processing entity ${entity.id} with type: ${entity.type} -> extracted: ${entityType}`,
    );

    switch (entityType) {
      case 'AirQualityObserved':
        await this.persistAirQuality(entity, notifiedAt);
        break;
      case 'WeatherObserved':
        await this.persistWeather(entity, notifiedAt);
        break;
      default:
        this.logger.warn(
          `Unknown entity type: ${entity.type} (extracted: ${entityType})`,
        );
    }
  }

  /**
   * Persist AirQualityObserved entity
   */
  private async persistAirQuality(
    entity: any,
    notifiedAt: string,
  ): Promise<void> {
    const record = new AirQualityObservedEntity();

    record.entityId = entity.id;
    record.entityType = this.extractEntityType(entity.type);
    record.recvTime = new Date(notifiedAt);

    // Extract locationId from locationId relationship
    if (entity.locationId) {
      record.locationId = this.extractValue(entity.locationId.object);
    }

    // Extract location
    if (entity.location) {
      record.location = entity.location.value || entity.location;
    }

    if (entity.address) {
      record.address = this.extractValue(entity.address);
    }

    // Extract observed properties
    if (entity.dateObserved) {
      record.dateObserved = new Date(this.extractValue(entity.dateObserved));
    }

    record.co = this.extractNumericValue(entity.co);
    record.no = this.extractNumericValue(entity.no);
    record.no2 = this.extractNumericValue(entity.no2);
    record.o3 = this.extractNumericValue(entity.o3);
    record.so2 = this.extractNumericValue(entity.so2);
    record.pm25 = this.extractNumericValue(entity.pm25);
    record.pm10 = this.extractNumericValue(entity.pm10);
    record.nh3 = this.extractNumericValue(entity.nh3);

    // Extract AQI indices
    record.airQualityIndex = this.extractNumericValue(entity.airQualityIndex);
    record.airQualityLevel = this.extractValue(entity.airQualityLevel);
    record.airQualityIndexUS = this.extractNumericValue(
      entity.airQualityIndexUS,
    );
    record.airQualityLevelUS = this.extractValue(entity.airQualityLevelUS);

    // Store raw entity
    record.rawEntity = entity;

    await this.airQualityRepo.save(record);
    this.logger.debug(`Persisted AirQuality: ${record.entityId}`);
  }

  /**
   * Persist WeatherObserved entity
   */
  private async persistWeather(entity: any, notifiedAt: string): Promise<void> {
    const record = new WeatherObservedEntity();

    record.entityId = entity.id;
    record.entityType = this.extractEntityType(entity.type);
    record.recvTime = new Date(notifiedAt);

    // Extract locationId from locationId relationship
    if (entity.locationId) {
      record.locationId = this.extractValue(entity.locationId.object);
    }

    // Extract location
    if (entity.location) {
      record.location = entity.location.value || entity.location;
    }

    if (entity.address) {
      record.address = this.extractValue(entity.address);
    }

    // Extract observed properties
    if (entity.dateObserved) {
      record.dateObserved = new Date(this.extractValue(entity.dateObserved));
    }

    record.temperature = this.extractNumericValue(entity.temperature);
    record.feelsLikeTemperature = this.extractNumericValue(
      entity.feelsLikeTemperature,
    );
    record.relativeHumidity = this.extractNumericValue(entity.relativeHumidity);
    record.atmosphericPressure = this.extractNumericValue(
      entity.atmosphericPressure,
    );
    record.windSpeed = this.extractNumericValue(entity.windSpeed);
    record.windDirection = this.extractNumericValue(entity.windDirection);
    record.precipitation = this.extractNumericValue(entity.precipitation);
    record.visibility = this.extractNumericValue(entity.visibility);
    record.weatherType = this.extractValue(entity.weatherType);
    record.weatherDescription = this.extractValue(entity.weatherDescription);
    record.weatherIconCode = this.extractValue(entity.weatherIconCode);

    // Additional weather fields
    record.cloudiness = this.extractNumericValue(entity.cloudiness);
    record.temperatureMin = this.extractNumericValue(entity.temperatureMin);
    record.temperatureMax = this.extractNumericValue(entity.temperatureMax);
    record.pressureSeaLevel = this.extractNumericValue(entity.pressureSeaLevel);
    record.pressureGroundLevel = this.extractNumericValue(
      entity.pressureGroundLevel,
    );
    record.windGust = this.extractNumericValue(entity.windGust);

    // Timestamp fields
    if (entity.sunrise) {
      const sunriseValue = this.extractValue(entity.sunrise);
      record.sunrise = sunriseValue ? new Date(sunriseValue) : null;
    }
    if (entity.sunset) {
      const sunsetValue = this.extractValue(entity.sunset);
      record.sunset = sunsetValue ? new Date(sunsetValue) : null;
    }
    record.timezone = this.extractNumericValue(entity.timezone);

    // Store raw entity
    record.rawEntity = entity;

    await this.weatherRepo.save(record);
    this.logger.debug(`Persisted Weather: ${record.entityId}`);
  }

  /**
   * Extract entity type from NGSI-LD type (handles full URIs and short names)
   */
  private extractEntityType(type: string): string {
    if (!type) return 'Unknown';

    // Handle full URI: https://smartdatamodels.org/dataModel.Environment/AirQualityObserved
    if (type.includes('/')) {
      return type.split('/').pop() || type;
    }

    return type;
  }

  /**
   * Extract value from NGSI-LD attribute
   * Handles both Property and Relationship types
   */
  private extractValue(attribute: any): any {
    if (!attribute) return null;

    // Direct value
    if (attribute.value !== undefined) {
      return attribute.value;
    }

    // Relationship object
    if (attribute.object !== undefined) {
      return attribute.object;
    }

    // Already a plain value
    return attribute;
  }

  /**
   * Extract numeric value from NGSI-LD attribute
   */
  private extractNumericValue(attribute: any): number | null {
    const value = this.extractValue(attribute);
    if (value === null || value === undefined) return null;

    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }
}
