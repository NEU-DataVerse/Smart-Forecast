import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Path params for weather forecast query
 */
export class ForecastWeatherParamsDto {
  @ApiProperty({
    description: 'Station ID (URN format)',
    example: 'urn:ngsi-ld:WeatherLocation:hanoi-hoan-kien',
  })
  @IsString()
  stationId: string;
}

/**
 * Query params for weather forecast endpoint
 */
export class ForecastWeatherQueryDto {
  @ApiProperty({
    description: 'Number of days to forecast (max 16)',
    example: 7,
    minimum: 1,
    maximum: 16,
    default: 7,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(16)
  @Type(() => Number)
  @IsOptional()
  days?: number = 7;
}
