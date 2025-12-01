import {
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
  Min,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Supported aggregation intervals for historical data
 * - raw: No aggregation, return raw data points
 * - hourly: Aggregate by hour
 * - 6h: Aggregate by 6-hour periods
 * - daily: Aggregate by day
 */
export type AggregationInterval = 'raw' | 'hourly' | '6h' | 'daily';

/**
 * Query DTO for weather data
 */
export class WeatherQueryDto {
  @IsOptional()
  @IsString()
  stationId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;

  @IsOptional()
  @IsString()
  @IsIn(['raw', 'hourly', '6h', 'daily'])
  interval?: AggregationInterval;
}
