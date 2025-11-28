import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IngestionService } from '../ingestion.service';

/**
 * Ingestion Scheduler
 * Automatically runs data ingestion at scheduled intervals
 */
@Injectable()
export class IngestionScheduler {
  private readonly logger = new Logger(IngestionScheduler.name);

  constructor(private readonly ingestionService: IngestionService) {}

  /**
   * Scheduled task: Ingest data every 1 hour
   * Runs at :00 of every hour
   */
  @Cron(CronExpression.EVERY_HOUR, {
    name: 'ingest-environmental-data-hourly',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleScheduledIngestion() {
    this.logger.log('🕐 Scheduled ingestion started');

    try {
      const result = await this.ingestionService.ingestAllData();

      this.logger.log(
        `✅ Scheduled ingestion completed successfully - AQ: ${result.airQuality.success}/${result.airQuality.success + result.airQuality.failed}, Weather: ${result.weather.success}/${result.weather.success + result.weather.failed}`,
      );

      // Log any errors
      if (result.airQuality.failed > 0) {
        this.logger.warn(
          `Air Quality ingestion had ${result.airQuality.failed} failures`,
        );
      }
      if (result.weather.failed > 0) {
        this.logger.warn(
          `Weather ingestion had ${result.weather.failed} failures`,
        );
      }
    } catch (error) {
      this.logger.error(
        '❌ Scheduled ingestion failed',
        error.stack || error.message,
      );
    }
  }
}
