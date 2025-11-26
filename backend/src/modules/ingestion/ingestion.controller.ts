import {
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { IngestionService } from './ingestion.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@smart-forecast/shared';

/**
 * Ingestion Controller
 * Provides endpoints for manual data ingestion triggers
 * Protected with ADMIN and MANAGER roles
 */
@ApiTags('Ingestion')
@ApiBearerAuth()
@Controller('ingestion')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  /**
   * Manually trigger air quality data ingestion
   * POST /api/v1/ingestion/air-quality
   */
  @Post('air-quality')
  @HttpCode(HttpStatus.OK)
  async ingestAirQuality() {
    const result = await this.ingestionService.ingestAirQualityData();
    return {
      message: 'Air quality data ingestion completed',
      ...result,
    };
  }

  /**
   * Manually trigger weather data ingestion
   * POST /api/v1/ingestion/weather
   */
  @Post('weather')
  @HttpCode(HttpStatus.OK)
  async ingestWeather() {
    const result = await this.ingestionService.ingestWeatherData();
    return {
      message: 'Weather data ingestion completed',
      ...result,
    };
  }

  /**
   * Manually trigger full data ingestion (Air Quality + Weather)
   * POST /api/v1/ingestion/all
   */
  @Post('all')
  @HttpCode(HttpStatus.OK)
  async ingestAll() {
    const result = await this.ingestionService.ingestAllData();
    return {
      message: 'Full data ingestion completed',
      ...result,
    };
  }

  /**
   * Get monitoring locations
   * GET /api/v1/ingestion/locations
   */
  @Get('locations')
  async getLocations(): Promise<{ count: number; locations: any[] }> {
    const locations = await this.ingestionService.getMonitoringLocations();
    return {
      count: locations.length,
      locations,
    };
  }

  /**
   * Health check for ingestion services
   * GET /api/v1/ingestion/health
   */
  @Get('health')
  async healthCheck() {
    const health = await this.ingestionService.healthCheck();
    return {
      status: health.owm && health.orion ? 'healthy' : 'degraded',
      services: {
        openWeatherMap: health.owm ? 'configured' : 'not configured',
        orionLD: health.orion ? 'accessible' : 'not accessible',
      },
    };
  }

  /**
   * Get ingestion statistics summary
   * GET /api/v1/ingestion/stats
   */
  @Get('stats')
  async getStats() {
    const locations = await this.ingestionService.getMonitoringLocations();
    return {
      message: 'Ingestion module statistics',
      locations: locations.length,
      endpoints: {
        current: {
          airQuality: 'POST /api/v1/ingestion/air-quality',
          weather: 'POST /api/v1/ingestion/weather',
        },
        all: 'POST /api/v1/ingestion/all',
      },
      description:
        'Current ingestion includes both real-time data and forecasts (Air Quality: 4-day forecast, Weather: 7-day forecast)',
    };
  }
}
