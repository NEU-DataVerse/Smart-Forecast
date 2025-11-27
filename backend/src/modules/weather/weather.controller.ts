import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { WeatherQueryDto, DateRangeQueryDto } from './dto';
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
  private readonly logger = new Logger(WeatherController.name);

  constructor(private readonly weatherService: WeatherService) {}

  /**
   * Get current weather from Orion-LD (all stations or filtered)
   * GET /api/v1/weather/current
   */
  @Get('current')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getCurrentWeather(
    @Query('stationId') stationId?: string,
    @Query('city') city?: string,
  ) {
    this.logger.log(
      `GET /weather/current - stationId: ${stationId}, city: ${city}`,
    );
    return this.weatherService.getCurrentWeather(stationId, city);
  }

  /**
   * Get weather forecast from Orion-LD (7-day daily)
   * GET /api/v1/weather/forecast
   */
  @Get('forecast')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getForecastWeather(@Query('stationId') stationId?: string) {
    this.logger.log(`GET /weather/forecast - stationId: ${stationId}`);
    return this.weatherService.getForecastWeather(stationId);
  }

  /**
   * Get historical weather from PostgreSQL
   * GET /api/v1/weather/history
   */
  @Get('history')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getHistoricalWeather(@Query() query: WeatherQueryDto) {
    this.logger.log(`GET /weather/history - query: ${JSON.stringify(query)}`);
    return this.weatherService.getHistoricalWeather(query);
  }

  /**
   * Get weather by specific station (current or latest)
   * GET /api/v1/weather/station/:stationId
   */
  @Get('station/:stationId')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getByStation(@Param('stationId') stationId: string) {
    this.logger.log(`GET /weather/station/${stationId}`);
    return this.weatherService.getByStation(stationId);
  }

  /**
   * Get weather trends (temperature, rainfall, humidity averages)
   * GET /api/v1/weather/stats/trends
   */
  @Get('stats/trends')
  @Roles(UserRole.ADMIN)
  async getWeatherTrends(@Query() query: DateRangeQueryDto) {
    this.logger.log(
      `GET /weather/stats/trends - query: ${JSON.stringify(query)}`,
    );
    return this.weatherService.getWeatherTrends(query);
  }
}
