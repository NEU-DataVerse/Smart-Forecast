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
import { WeatherService } from './weather.service';
import { CurrentWeatherParamsDto } from './dto/current-weather-params.dto';
import {
  HistoryWeatherParamsDto,
  HistoryWeatherQueryDto,
} from './dto/history-weather.dto';
import {
  ForecastWeatherParamsDto,
  ForecastWeatherQueryDto,
} from './dto/forecast-weather.dto';
import type {
  IWeatherObserved,
  IWeatherDataPoint,
  IWeatherForecastResponse,
} from '@smart-forecast/shared';

/**
 * Weather Controller
 *
 * Provides weather data endpoints for admin dashboard
 */
@ApiTags('Weather - Admin')
@Controller('weather')
@UsePipes(new ValidationPipe({ transform: true }))
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  /**
   * Get current weather for a specific station
   */
  @Get('current/:stationId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get current weather',
    description:
      'Returns the most recent weather observation for a specific monitoring station',
  })
  @ApiParam({
    name: 'stationId',
    example: 'urn:ngsi-ld:WeatherLocation:hanoi-hoan-kien',
    description: 'Station URN identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Current weather data',
    schema: {
      example: {
        id: 'urn:ngsi-ld:WeatherObserved:hanoi-hoan-kien-1732099200',
        type: 'WeatherObserved',
        dateObserved: '2025-11-20T10:00:00Z',
        location: { type: 'Point', coordinates: [105.804817, 21.028511] },
        temperature: 28.5,
        feelsLikeTemperature: 30.2,
        relativeHumidity: 65,
        atmosphericPressure: 1013,
        windSpeed: 3.5,
        windDirection: 180,
        weatherType: 'Clear',
        weatherDescription: 'clear sky',
        source: 'OpenWeatherMap',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Station or data not found' })
  async getCurrentWeather(
    @Param() params: CurrentWeatherParamsDto,
  ): Promise<IWeatherObserved> {
    return this.weatherService.getCurrentWeather(params.stationId);
  }

  /**
   * Get historical weather data for a station
   */
  @Get('history/:stationId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get weather history',
    description: 'Returns historical weather data for charts and analytics',
  })
  @ApiParam({
    name: 'stationId',
    example: 'urn:ngsi-ld:WeatherLocation:hanoi-hoan-kien',
  })
  @ApiResponse({
    status: 200,
    description: 'Historical weather data points',
    schema: {
      example: [
        {
          timestamp: '2025-11-20T00:00:00Z',
          temperature: 25.5,
          humidity: 70,
          precipitation: 0,
          weatherType: 'Clouds',
        },
      ],
    },
  })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async getWeatherHistory(
    @Param() params: HistoryWeatherParamsDto,
    @Query() query: HistoryWeatherQueryDto,
  ): Promise<IWeatherDataPoint[]> {
    return this.weatherService.getWeatherHistory(
      params.stationId,
      query.startDate,
      query.endDate,
      query.limit,
    );
  }

  /**
   * Get weather forecast for a station
   */
  @Get('forecast/:stationId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get weather forecast',
    description: 'Returns weather forecast in OpenWeatherMap-compatible format',
  })
  @ApiParam({
    name: 'stationId',
    example: 'urn:ngsi-ld:WeatherLocation:hanoi-hoan-kien',
  })
  @ApiResponse({
    status: 200,
    description: 'Weather forecast (OWM format)',
    schema: {
      example: {
        city: {
          coord: { lat: 21.028511, lon: 105.804817 },
          name: 'Hanoi',
          country: 'VN',
          timezone: 25200,
        },
        list: [
          {
            dt: 1732104000,
            temp: {
              day: 28.5,
              min: 22.1,
              max: 31.2,
              night: 23.5,
              eve: 27.8,
              morn: 24.2,
            },
            feels_like: { day: 30.2, night: 24.5, eve: 29.1, morn: 25.3 },
            pressure: 1013,
            humidity: 65,
            weather: [
              {
                id: 800,
                main: 'Clear',
                description: 'clear sky',
                icon: '01d',
              },
            ],
            speed: 3.5,
            deg: 180,
            clouds: 10,
            pop: 0.1,
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async getWeatherForecast(
    @Param() params: ForecastWeatherParamsDto,
    @Query() query: ForecastWeatherQueryDto,
  ): Promise<IWeatherForecastResponse> {
    return this.weatherService.getWeatherForecast(params.stationId, query.days);
  }
}
