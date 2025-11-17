import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OpenAQService } from './openaq.service';

/**
 * Service for managing air quality data collection and processing
 */
@Injectable()
export class AirQualityService {
  private readonly logger = new Logger(AirQualityService.name);

  constructor(private readonly openAQService: OpenAQService) {}

  /**
   * Scheduled job to ingest air quality data every 30 minutes
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async scheduledIngestion(): Promise<void> {
    this.logger.log('Starting scheduled air quality data ingestion...');
    try {
      await this.openAQService.ingestAirQualityData();
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
   * @param cities Optional array of cities to ingest data for
   */
  async triggerIngestion(cities?: string[]): Promise<void> {
    this.logger.log('Manual air quality data ingestion triggered');
    await this.openAQService.ingestAirQualityData(cities);
  }

  /**
   * Get available cities for air quality monitoring
   * @returns Array of city names
   */
  async getAvailableCities(): Promise<string[]> {
    return this.openAQService.getAvailableCities();
  }
}
