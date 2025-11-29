import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import {
  WeatherQueryDto,
  DateRangeQueryDto,
  NearbyQueryDto,
  CompareQueryDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@smart-forecast/shared';

/**
 * Weather Controller
 * Endpoints for querying weather data (current, forecast, historical)
 */
@ApiTags('Weather')
@ApiBearerAuth()
@Controller('weather')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  /**
   * Get current weather from Orion-LD (all stations or filtered)
   * GET /api/v1/weather/current
   */
  @Get('current')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get current weather data' })
  @ApiQuery({ name: 'stationId', required: false })
  @ApiResponse({ status: 200, description: 'Current weather data' })
  async getCurrentWeather(@Query('stationId') stationId?: string) {
    return this.weatherService.getCurrentWeather(stationId);
  }

  /**
   * Get weather forecast from Orion-LD (7-day daily)
   * GET /api/v1/weather/forecast
   */
  @Get('forecast')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get weather forecast' })
  @ApiQuery({ name: 'stationId', required: false })
  @ApiResponse({ status: 200, description: 'Weather forecast data' })
  async getForecastWeather(@Query('stationId') stationId?: string) {
    return this.weatherService.getForecastWeather(stationId);
  }

  /**
   * Get weather by GPS coordinates (for mobile)
   * GET /api/v1/weather/nearby
   */
  @Get('nearby')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get weather by GPS coordinates (mobile)' })
  @ApiResponse({
    status: 200,
    description: 'Weather data from nearest station',
  })
  async getNearbyWeather(@Query() query: NearbyQueryDto) {
    return this.weatherService.getNearbyWeather(
      query.lat,
      query.lon,
      query.radius,
      query.include,
    );
  }

  /**
   * Compare weather across multiple stations (admin dashboard)
   * GET /api/v1/weather/compare
   */
  @Get('compare')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Compare weather across multiple stations' })
  @ApiResponse({ status: 200, description: 'Multi-station weather comparison' })
  async compareStations(@Query() query: CompareQueryDto) {
    return this.weatherService.compareStations(query.stationCodes);
  }

  /**
   * Get historical weather from PostgreSQL
   * GET /api/v1/weather/history
   */
  @Get('history')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get historical weather data' })
  @ApiResponse({ status: 200, description: 'Historical weather data' })
  async getHistoricalWeather(@Query() query: WeatherQueryDto) {
    return this.weatherService.getHistoricalWeather(query);
  }

  /**
   * Get weather trends (temperature, rainfall, humidity averages)
   * GET /api/v1/weather/stats/trends
   */
  @Get('stats/trends')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get weather trends and statistics' })
  @ApiResponse({ status: 200, description: 'Weather trend statistics' })
  async getWeatherTrends(@Query() query: DateRangeQueryDto) {
    return this.weatherService.getWeatherTrends(query);
  }
}
