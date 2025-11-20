import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Path params DTO for current air quality query
 */
export class CurrentAirQualityParamsDto {
  @ApiProperty({
    description: 'Station ID (URN format)',
    example: 'urn:ngsi-ld:WeatherLocation:hanoi-hoan-kien',
  })
  @IsString()
  stationId: string;
}
