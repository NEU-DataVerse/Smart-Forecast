import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Allowed NGSI-LD entity types for public API (full URIs as stored in Orion-LD)
 * Only expose specific entity types for external consumers
 */
export enum AllowedEntityType {
  WEATHER_OBSERVED = 'https://smartdatamodels.org/dataModel.Weather/WeatherObserved',
  AIR_QUALITY_OBSERVED = 'https://smartdatamodels.org/dataModel.Environment/AirQualityObserved',
  WEATHER_FORECAST = 'https://smartdatamodels.org/dataModel.Weather/WeatherForecast',
  AIR_QUALITY_FORECAST = 'https://smartdatamodels.org/dataModel.Environment/AirQualityForecast',
  WEATHER_ALERT = 'https://smartdatamodels.org/dataModel.Weather/WeatherAlert',
}

/**
 * Short name to full URI mapping for convenience
 */
export const EntityTypeShortNames: Record<string, AllowedEntityType> = {
  WeatherObserved: AllowedEntityType.WEATHER_OBSERVED,
  AirQualityObserved: AllowedEntityType.AIR_QUALITY_OBSERVED,
  WeatherForecast: AllowedEntityType.WEATHER_FORECAST,
  AirQualityForecast: AllowedEntityType.AIR_QUALITY_FORECAST,
  WeatherAlert: AllowedEntityType.WEATHER_ALERT,
};

/**
 * DTO for querying NGSI-LD entities
 * Validates and transforms query parameters
 */
export class QueryEntitiesDto {
  @ApiPropertyOptional({
    description:
      'Entity type to filter. Use short name (e.g., WeatherObserved) or full URI.',
    example: 'WeatherObserved',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of entities to return',
    minimum: 1,
    maximum: 100,
    default: 20,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Number of entities to skip (pagination)',
    minimum: 0,
    default: 0,
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional({
    description:
      'NGSI-LD query expression. Use attribute names as stored in Orion. For short name attributes (e.g., cloudiness, temperatureMax): cloudiness>50. Multiple conditions: cloudiness>50;cloudiness<100. Operators: ==, !=, >, <, >=, <=, ~= (pattern match)',
    example: 'cloudiness>50',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description:
      'Comma-separated list of attributes to return. Use full URI for Smart Data Models attributes (e.g., https://smartdatamodels.org/dataModel.Environment/co) or short names if @context is provided.',
    example: 'https://smartdatamodels.org/dataModel.Weather/temperature',
  })
  @IsOptional()
  @IsString()
  attrs?: string;

  @ApiPropertyOptional({
    description:
      'Geo-relationship for geo-query. For "near", use format: near;maxDistance==<meters> (e.g., near;maxDistance==5000)',
    example: 'near;maxDistance==5000',
  })
  @IsOptional()
  @IsString()
  georel?: string;

  @ApiPropertyOptional({
    description: 'Geometry type for geo-query',
    example: 'Point',
  })
  @IsOptional()
  @IsIn([
    'Point',
    'Polygon',
    'LineString',
    'MultiPoint',
    'MultiPolygon',
    'MultiLineString',
  ])
  geometry?: string;

  @ApiPropertyOptional({
    description: 'Coordinates for geo-query (format depends on geometry type)',
    example: '[105.8342,21.0278]',
  })
  @IsOptional()
  @IsString()
  coordinates?: string;

  @ApiPropertyOptional({
    description: 'Geo-property to use for geo-query',
    default: 'location',
    example: 'location',
  })
  @IsOptional()
  @IsString()
  geoproperty?: string = 'location';
}

/**
 * DTO for getting a single entity by ID
 */
export class GetEntityByIdDto {
  @ApiPropertyOptional({
    description:
      'Comma-separated list of attributes to return. Use full URI for Smart Data Models attributes (e.g., https://smartdatamodels.org/dataModel.Environment/co)',
    example: 'https://smartdatamodels.org/dataModel.Weather/temperature',
  })
  @IsOptional()
  @IsString()
  attrs?: string;
}
