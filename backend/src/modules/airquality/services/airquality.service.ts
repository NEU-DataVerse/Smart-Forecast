import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AirPollutionService } from './openaq.service';

/**
 * Service for managing air quality data collection and processing
 */
@Injectable()
export class AirQualityService {
  private readonly logger = new Logger(AirQualityService.name);

  constructor(private readonly airPollutionService: AirPollutionService) {}

  /**
   * Scheduled job to ingest air quality data every 30 minutes
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async scheduledIngestion(): Promise<void> {
    this.logger.log('Starting scheduled air quality data ingestion...');
    try {
      await this.airPollutionService.ingestAirQualityData();
      this.logger.log('Scheduled air quality data ingestion completed');
    } catch (error) {
      this.logger.error(
        `Scheduled air quality data ingestion failed: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Manually trigger air quality data ingestion
   * @param cities Optional array of city objects with coordinates
   */
  async triggerIngestion(
    cities?: Array<{ name: string; lat: number; lon: number }>,
  ): Promise<void> {
    this.logger.log('Manual air quality data ingestion triggered');
    await this.airPollutionService.ingestAirQualityData(cities);
  } this.logger.log('Manual air quality data ingestion triggered');
    await this.airPollutionService.ingestAirQualityData(cities);
  }
}
}
