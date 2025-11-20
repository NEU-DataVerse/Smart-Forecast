import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Path params for forecast query
 */
export class ForecastAirQualityParamsDto {
  @ApiProperty({
    description: 'Station ID (URN format)',
    example: 'urn:ngsi-ld:WeatherLocation:hanoi-hoan-kien',
  })
  @IsString()
  stationId: string;
}

/**
 * Query params for forecast endpoint
 */
export class ForecastAirQualityQueryDto {
  @ApiProperty({
    description: 'Number of hours to forecast (max 96 for 4 days)',
    example: 96,
    minimum: 1,
    maximum: 96,
    default: 96,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(96)
  @Type(() => Number)
  @IsOptional()
  hours?: number = 96;
}
