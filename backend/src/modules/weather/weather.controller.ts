import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherQueryDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@smart-forecast/shared';

/**
 * Weather Controller
 * Endpoints for querying weather data (current, forecast, historical)
 */
@Controller('weather')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRole.ADMIN, UserRole.MANAGER)
export class WeatherController {
  private readonly logger = new Logger(WeatherController.name);

  constructor(private readonly weatherService: WeatherService) {}

  /**
   * Get current weather from Orion-LD (all stations or filtered)
   * GET /api/v1/weather/current
   */
  @Get('current')
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
  async getForecastWeather(@Query('stationId') stationId?: string) {
    this.logger.log(`GET /weather/forecast - stationId: ${stationId}`);
    return this.weatherService.getForecastWeather(stationId);
  }

  /**
   * Get historical weather from PostgreSQL
   * GET /api/v1/weather/history
   */
  @Get('history')
  async getHistoricalWeather(@Query() query: WeatherQueryDto) {
    this.logger.log(`GET /weather/history - query: ${JSON.stringify(query)}`);
    return this.weatherService.getHistoricalWeather(query);
  }

  /**
   * Get weather by specific station (current or latest)
   * GET /api/v1/weather/station/:stationId
   */
  @Get('station/:stationId')
  async getByStation(@Param('stationId') stationId: string) {
    this.logger.log(`GET /weather/station/${stationId}`);
    return this.weatherService.getByStation(stationId);
  }
}
