import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AirQualityService } from './air-quality.service';
import { AirQualityQueryDto, DateRangeQueryDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@smart-forecast/shared';

/**
 * Air Quality Controller
 * Endpoints for querying air quality data (current, forecast, historical)
 */
@ApiTags('Air Quality')
@ApiBearerAuth()
@Controller('air-quality')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AirQualityController {
  private readonly logger = new Logger(AirQualityController.name);

  constructor(private readonly airQualityService: AirQualityService) {}

  /**
   * Get current air quality from Orion-LD (all stations or filtered)
   * GET /api/v1/air-quality/current
   */
  @Get('current')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getCurrentAirQuality(
    @Query('stationId') stationId?: string,
    @Query('city') city?: string,
  ) {
    this.logger.log(
      `GET /air-quality/current - stationId: ${stationId}, city: ${city}`,
    );
    return this.airQualityService.getCurrentAirQuality(stationId, city);
  }

  /**
   * Get air quality forecast from Orion-LD (4-day hourly)
   * GET /api/v1/air-quality/forecast
   */
  @Get('forecast')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getForecastAirQuality(@Query('stationId') stationId?: string) {
    this.logger.log(`GET /air-quality/forecast - stationId: ${stationId}`);
    return this.airQualityService.getForecastAirQuality(stationId);
  }

  /**
   * Get historical air quality from PostgreSQL
   * GET /api/v1/air-quality/history
   */
  @Get('history')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getHistoricalAirQuality(@Query() query: AirQualityQueryDto) {
    this.logger.log(
      `GET /air-quality/history - query: ${JSON.stringify(query)}`,
    );
    return this.airQualityService.getHistoricalAirQuality(query);
  }

  /**
   * Get air quality by specific station (current or latest)
   * GET /api/v1/air-quality/station/:stationId
   */
  @Get('station/:stationId')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getByStation(@Param('stationId') stationId: string) {
    this.logger.log(`GET /air-quality/station/${stationId}`);
    return this.airQualityService.getByStation(stationId);
  }

  /**
   * Get AQI averages and components
   * GET /api/v1/air-quality/stats/averages
   */
  @Get('stats/averages')
  @Roles(UserRole.ADMIN)
  async getAQIAverages(@Query() query: DateRangeQueryDto) {
    this.logger.log(
      `GET /air-quality/stats/averages - query: ${JSON.stringify(query)}`,
    );
    return this.airQualityService.getAQIAverages(query);
  }
}
