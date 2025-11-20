import { Controller, Get, Param, Query, HttpCode } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { StationsService } from './stations.service';
import { StationsQueryDto } from './dto/stations-query.dto';
import type { IStation } from '@smart-forecast/shared';

/**
 * Stations Controller
 *
 * Manages monitoring station endpoints
 */
@ApiTags('Stations')
@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  /**
   * Get all monitoring stations
   * Optionally filter by city
   */
  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get all monitoring stations',
    description:
      'Returns list of all weather/air quality monitoring stations, optionally filtered by city',
  })
  @ApiQuery({
    name: 'city',
    required: false,
    type: String,
    example: 'Hanoi',
    description: 'Filter stations by city name',
  })
  @ApiResponse({
    status: 200,
    description: 'List of stations',
    schema: {
      example: [
        {
          id: 'urn:ngsi-ld:WeatherLocation:hanoi-hoan-kien',
          type: 'WeatherLocation',
          name: 'Hồ Hoàn Kiếm',
          city: 'Hanoi',
          district: 'Hoàn Kiếm',
          location: { lat: 21.028511, lon: 105.804817 },
          address: { addressLocality: 'Hoàn Kiếm', addressCountry: 'VN' },
          timezone: 25200,
        },
      ],
    },
  })
  getAllStations(@Query() query: StationsQueryDto): IStation[] {
    return this.stationsService.getAllStations(query.city);
  }

  /**
   * Get station by ID
   */
  @Get(':id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get station by ID',
    description:
      'Returns detailed information about a specific monitoring station',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'urn:ngsi-ld:WeatherLocation:hanoi-hoan-kien',
    description: 'Station URN identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Station details',
    schema: {
      example: {
        id: 'urn:ngsi-ld:WeatherLocation:hanoi-hoan-kien',
        type: 'WeatherLocation',
        name: 'Hồ Hoàn Kiếm',
        city: 'Hanoi',
        district: 'Hoàn Kiếm',
        location: { lat: 21.028511, lon: 105.804817 },
        address: { addressLocality: 'Hoàn Kiếm', addressCountry: 'VN' },
        timezone: 25200,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Station not found',
  })
  getStationById(@Param('id') id: string): IStation {
    return this.stationsService.getStationById(id);
  }
}
