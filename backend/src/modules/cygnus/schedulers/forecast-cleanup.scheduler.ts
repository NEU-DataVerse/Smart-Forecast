import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OrionClientProvider } from '../../ingestion/providers/orion-client.provider';

/**
 * Forecast Cleanup Scheduler
 * Automatically cleans up old forecast entities from Orion-LD
 * Runs daily at 2:00 AM to remove forecasts older than 14 days
 */
@Injectable()
export class ForecastCleanupScheduler {
  private readonly logger = new Logger(ForecastCleanupScheduler.name);

  // Forecast entity types to cleanup
  private readonly forecastTypes = ['AirQualityForecast', 'WeatherForecast'];

  // Retention period in days (forecasts older than this will be deleted)
  private readonly retentionDays = 14;

  constructor(private readonly orionClient: OrionClientProvider) {}

  /**
   * Scheduled task - Runs daily at 2:00 AM (Asia/Ho_Chi_Minh timezone)
   */
  @Cron('0 2 * * *', {
    name: 'forecast-cleanup',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async cleanupOldForecasts() {
    this.logger.log(
      `Starting forecast cleanup (retention: ${this.retentionDays} days)...`,
    );

    const cutoffTimestamp = this.getCutoffTimestamp();
    this.logger.debug(
      `Cutoff timestamp: ${new Date(cutoffTimestamp * 1000).toISOString()}`,
    );

    let totalDeleted = 0;

    for (const entityType of this.forecastTypes) {
      try {
        const deletedCount = await this.cleanupForecastType(
          entityType,
          cutoffTimestamp,
        );
        totalDeleted += deletedCount;

        this.logger.log(`✓ Cleaned up ${deletedCount} ${entityType} entities`);
      } catch (error) {
        this.logger.error(
          `✗ Failed to cleanup ${entityType}`,
          error.message,
          error.stack,
        );
      }
    }

    this.logger.log(
      `Forecast cleanup completed: ${totalDeleted} entities deleted`,
    );
  }

  /**
   * Cleanup forecast entities of a specific type
   */
  private async cleanupForecastType(
    entityType: string,
    cutoffTimestamp: number,
  ): Promise<number> {
    try {
      // Query all entities of this type
      this.logger.debug(`Querying ${entityType} entities...`);

      const entities = await this.orionClient.queryEntities({
        type: entityType,
        limit: 1000, // Process in batches
      });

      if (entities.length === 0) {
        this.logger.debug(`No ${entityType} entities found`);
        return 0;
      }

      this.logger.debug(`Found ${entities.length} ${entityType} entities`);

      // Filter entities to delete (based on timestamp in entity ID)
      const entitiesToDelete = entities.filter((entity) =>
        this.isOldForecast(entity.id, cutoffTimestamp),
      );

      if (entitiesToDelete.length === 0) {
        this.logger.debug(`No old ${entityType} entities to delete`);
        return 0;
      }

      this.logger.debug(
        `Deleting ${entitiesToDelete.length} old ${entityType} entities...`,
      );

      // Delete entities
      let deletedCount = 0;
      for (const entity of entitiesToDelete) {
        try {
          await this.orionClient.deleteEntity(entity.id);
          deletedCount++;
        } catch (error) {
          this.logger.warn(
            `Failed to delete entity ${entity.id}: ${error.message}`,
          );
        }
      }

      return deletedCount;
    } catch (error) {
      this.logger.error(
        `Failed to cleanup ${entityType}`,
        error.message,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Check if a forecast entity is older than retention period
   * Entity ID format: urn:ngsi-ld:AirQualityForecast:HoanKiem-21.0285-105.8048-1700150400
   * Last segment is Unix timestamp
   */
  private isOldForecast(entityId: string, cutoffTimestamp: number): boolean {
    try {
      // Extract timestamp from entity ID (last segment after last hyphen)
      const segments = entityId.split('-');
      const timestampStr = segments[segments.length - 1];
      const timestamp = parseInt(timestampStr, 10);

      if (isNaN(timestamp)) {
        this.logger.warn(
          `Could not parse timestamp from entity ID: ${entityId}`,
        );
        return false;
      }

      return timestamp < cutoffTimestamp;
    } catch (error) {
      this.logger.warn(`Error checking entity age: ${entityId}`, error.message);
      return false;
    }
  }

  /**
   * Calculate cutoff timestamp (Unix timestamp in seconds)
   */
  private getCutoffTimestamp(): number {
    const now = Date.now();
    const retentionMs = this.retentionDays * 24 * 60 * 60 * 1000;
    return Math.floor((now - retentionMs) / 1000);
  }

  /**
   * Manual trigger for cleanup (for admin operations)
   */
  async triggerCleanup(): Promise<{
    deleted: number;
    cutoffDate: string;
  }> {
    this.logger.log('Manual forecast cleanup triggered');

    const cutoffTimestamp = this.getCutoffTimestamp();
    let totalDeleted = 0;

    for (const entityType of this.forecastTypes) {
      try {
        const deletedCount = await this.cleanupForecastType(
          entityType,
          cutoffTimestamp,
        );
        totalDeleted += deletedCount;
      } catch (error) {
        this.logger.error(`Failed to cleanup ${entityType}`, error.message);
      }
    }

    return {
      deleted: totalDeleted,
      cutoffDate: new Date(cutoffTimestamp * 1000).toISOString(),
    };
  }
}
