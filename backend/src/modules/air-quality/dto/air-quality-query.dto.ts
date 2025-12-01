import {
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
  IsIn,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Aggregation interval for air quality history data
 * - raw: Return raw data points (no aggregation)
 * - hourly: Aggregate data per hour
 * - 6h: Aggregate data per 6-hour period
 * - daily: Aggregate data per day
 */
export type AQAggregationInterval = 'raw' | 'hourly' | '6h' | 'daily';

/**
 * Query DTO for air quality historical data
 */
export class AirQualityQueryDto {
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

  /**
   * Aggregation interval for the data
   * - raw: Return raw data points (default)
   * - hourly: Aggregate data per hour (for 24h range)
   * - 6h: Aggregate data per 6-hour period (for 7d range)
   * - daily: Aggregate data per day (for 30d range)
   */
  @IsOptional()
  @IsString()
  @IsIn(['raw', 'hourly', '6h', 'daily'])
  interval?: AQAggregationInterval;
}
