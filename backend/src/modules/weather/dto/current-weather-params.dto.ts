import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Path params DTO for current weather query
 */
export class CurrentWeatherParamsDto {
  @ApiProperty({
    description: 'Station ID (URN format)',
    example: 'urn:ngsi-ld:WeatherLocation:hanoi-hoan-kien',
  })
  @IsString()
  stationId: string;
}
