import {
  Controller,
  Get,
  Param,
  Query,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AirQualityService } from './airquality.service';
import { CurrentAirQualityParamsDto } from './dto/current-airquality-params.dto';
import {
  HistoryAirQualityParamsDto,
  HistoryQueryDto,
} from './dto/history-airquality.dto';
import {
  ForecastAirQualityParamsDto,
  ForecastAirQualityQueryDto,
} from './dto/forecast-airquality.dto';
import {
  IAirQualityObserved,
  IAirQualityDataPoint,
  IAirQualityForecastResponse,
} from '@smart-forecast/shared';

/**
 * Air Quality Controller
 *
 * Provides air quality data endpoints for admin dashboard
 */
@ApiTags('Air Quality - Admin')
@Controller('airquality')
@UsePipes(new ValidationPipe({ transform: true }))
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) {}

  /**
   * Get current air quality for a specific station
   */
  @Get('current/:stationId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get current air quality',
    description:
      'Returns the most recent air quality observation for a specific monitoring station',
  })
  @ApiParam({
    name: 'stationId',
    example: 'urn:ngsi-ld:WeatherLocation:hanoi-hoan-kien',
    description: 'Station URN identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Current air quality data',
    schema: {
      example: {
        id: 'urn:ngsi-ld:AirQualityObserved:hanoi-hoan-kien-1732099200',
        type: 'AirQualityObserved',
        dateObserved: '2025-11-20T10:00:00Z',
        location: { type: 'Point', coordinates: [105.804817, 21.028511] },
        pm25: 35.5,
        pm10: 45.2,
        aqi: 85,
        aqiCategory: 'Moderate',
        source: 'OpenWeatherMap',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Station or data not found' })
  async getCurrentAirQuality(
    @Param() params: CurrentAirQualityParamsDto,
  ): Promise<IAirQualityObserved> {
    return this.airQualityService.getCurrentAirQuality(params.stationId);
  }

  /**
   * Get historical air quality data for a station
   */
  @Get('history/:stationId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get air quality history',
    description: 'Returns historical air quality data for charts and analytics',
  })
  @ApiParam({
    name: 'stationId',
    example: 'urn:ngsi-ld:WeatherLocation:hanoi-hoan-kien',
  })
  @ApiResponse({
    status: 200,
    description: 'Historical air quality data points',
    schema: {
      example: [
        {
          timestamp: '2025-11-20T00:00:00Z',
          aqi: 75,
          pm25: 28.5,
          pm10: 42.1,
          category: 'Moderate',
        },
      ],
    },
  })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async getAirQualityHistory(
    @Param() params: HistoryAirQualityParamsDto,
    @Query() query: HistoryQueryDto,
  ): Promise<IAirQualityDataPoint[]> {
    return this.airQualityService.getAirQualityHistory(
      params.stationId,
      query.startDate,
      query.endDate,
      query.limit,
    );
  }

  /**
   * Get air quality forecast for a station
   */
  @Get('forecast/:stationId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get air quality forecast',
    description:
      'Returns air quality forecast in OpenWeatherMap-compatible format',
  })
  @ApiParam({
    name: 'stationId',
    example: 'urn:ngsi-ld:WeatherLocation:hanoi-hoan-kien',
  })
  @ApiResponse({
    status: 200,
    description: 'Air quality forecast (OWM format)',
    schema: {
      example: {
        coord: { lat: 21.028511, lon: 105.804817 },
        list: [
          {
            dt: 1732104000,
            main: { aqi: 3 },
            components: {
              co: 203.6,
              no: 0.1,
              no2: 12.5,
              o3: 68.2,
              so2: 3.4,
              pm2_5: 28.3,
              pm10: 45.1,
              nh3: 0.5,
            },
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async getAirQualityForecast(
    @Param() params: ForecastAirQualityParamsDto,
    @Query() query: ForecastAirQualityQueryDto,
  ): Promise<IAirQualityForecastResponse> {
    return this.airQualityService.getAirQualityForecast(
      params.stationId,
      query.hours,
    );
  }
}
