import { Controller, Get, Query, UseGuards, Logger } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AirQualityService } from './air-quality.service';
import {
  AirQualityQueryDto,
  DateRangeQueryDto,
  NearbyQueryDto,
  CompareQueryDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@smart-forecast/shared';

/**
 * Air Quality Controller
 * Endpoints for querying air quality data (current, forecast, historical, nearby, compare)
 */
@ApiTags('Air Quality')
@ApiBearerAuth()
@Controller('air-quality')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AirQualityController {
  private readonly logger = new Logger(AirQualityController.name);

  constructor(private readonly airQualityService: AirQualityService) {}

  /**
   * Get current air quality from Orion-LD (all stations or filtered by stationId)
   * GET /api/v1/air-quality/current
   */
  @Get('current')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get current air quality data' })
  @ApiQuery({
    name: 'stationId',
    required: false,
    description: 'Filter by station ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Current air quality data from all or specific station',
  })
  async getCurrentAirQuality(@Query('stationId') stationId?: string) {
    this.logger.log(`GET /air-quality/current - stationId: ${stationId}`);
    return this.airQualityService.getCurrentAirQuality(stationId);
  }

  /**
   * Get air quality forecast from Orion-LD (4-day hourly)
   * GET /api/v1/air-quality/forecast
   */
  @Get('forecast')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get air quality forecast (4-day hourly)' })
  @ApiQuery({
    name: 'stationId',
    required: false,
    description: 'Filter by station ID',
  })
  @ApiResponse({ status: 200, description: 'Air quality forecast data' })
  async getForecastAirQuality(@Query('stationId') stationId?: string) {
    this.logger.log(`GET /air-quality/forecast - stationId: ${stationId}`);
    return this.airQualityService.getForecastAirQuality(stationId);
  }

  /**
   * Get air quality by GPS coordinates (for mobile apps)
   * Finds nearest station and returns current/forecast data
   * GET /api/v1/air-quality/nearby
   */
  @Get('nearby')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get air quality by GPS location (mobile)',
    description:
      'Find nearest station based on GPS coordinates and return air quality data. Useful for mobile apps with location services.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Air quality data from nearest station with distance info and cache validity',
  })
  @ApiResponse({ status: 404, description: 'No stations found within radius' })
  async getNearbyAirQuality(@Query() query: NearbyQueryDto) {
    this.logger.log(
      `GET /air-quality/nearby - lat: ${query.lat}, lon: ${query.lon}, radius: ${query.radius}, include: ${query.include}`,
    );
    return await this.airQualityService.getNearbyAirQuality(
      query.lat,
      query.lon,
      query.radius,
      query.include,
    );
  }

  /**
   * Compare air quality across multiple stations (for admin dashboard)
   * GET /api/v1/air-quality/compare
   */
  @Get('compare')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Compare air quality across multiple stations (admin)',
    description:
      'Get current air quality data from multiple stations for comparison. Useful for admin dashboard charts.',
  })
  @ApiResponse({
    status: 200,
    description: 'Air quality comparison data from multiple stations',
  })
  async compareStations(@Query() query: CompareQueryDto) {
    this.logger.log(
      `GET /air-quality/compare - stationCodes: ${query.stationCodes.join(', ')}`,
    );
    return await this.airQualityService.compareStations(query.stationCodes);
  }

  /**
   * Get historical air quality from PostgreSQL
   * GET /api/v1/air-quality/history
   */
  @Get('history')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get historical air quality data' })
  @ApiResponse({
    status: 200,
    description: 'Paginated historical air quality data',
  })
  async getHistoricalAirQuality(@Query() query: AirQualityQueryDto) {
    this.logger.log(
      `GET /air-quality/history - query: ${JSON.stringify(query)}`,
    );
    return this.airQualityService.getHistoricalAirQuality(query);
  }

  /**
   * Get AQI averages and components (admin only)
   * GET /api/v1/air-quality/stats/averages
   */
  @Get('stats/averages')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get AQI averages and pollutant statistics (admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'AQI averages and pollutant component statistics',
  })
  async getAQIAverages(@Query() query: DateRangeQueryDto) {
    this.logger.log(
      `GET /air-quality/stats/averages - query: ${JSON.stringify(query)}`,
    );
    return this.airQualityService.getAQIAverages(query);
  }
}
