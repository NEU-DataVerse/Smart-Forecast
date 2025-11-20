import {
  IsString,
  IsISO8601,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Path params for history query
 */
export class HistoryAirQualityParamsDto {
  @ApiProperty({
    description: 'Station ID (URN format)',
    example: 'urn:ngsi-ld:WeatherLocation:hanoi-hoan-kien',
  })
  @IsString()
  stationId: string;
}

/**
 * Query params for history endpoint
 */
export class HistoryQueryDto {
  @ApiProperty({
    description: 'Start date (ISO 8601 format)',
    example: '2025-11-01T00:00:00Z',
    required: false,
  })
  @IsISO8601()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: 'End date (ISO 8601 format)',
    example: '2025-11-20T23:59:59Z',
    required: false,
  })
  @IsISO8601()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    description: 'Maximum number of records to return',
    example: 100,
    minimum: 1,
    maximum: 1000,
    default: 100,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(1000)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 100;
}
