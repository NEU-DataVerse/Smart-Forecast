import { Controller, Post, Body, Logger, HttpCode } from '@nestjs/common';
import { PersistenceService } from './services/persistence.service';

/**
 * Persistence Controller
 *
 * Receives NGSI-LD notifications from Orion-LD subscriptions
 * Endpoint: POST /notify
 */
@Controller('notify')
export class PersistenceController {
  private readonly logger = new Logger(PersistenceController.name);

  constructor(private readonly persistenceService: PersistenceService) {}

  /**
   * Handle NGSI-LD notification from Orion-LD
   *
   * Orion-LD sends notifications in this format:
   * {
   *   "id": "urn:ngsi-ld:Notification:...",
   *   "type": "Notification",
   *   "subscriptionId": "urn:ngsi-ld:Subscription:...",
   *   "notifiedAt": "2025-11-20T...",
   *   "data": [
   *     {
   *       "id": "urn:ngsi-ld:AirQualityObserved:...",
   *       "type": "AirQualityObserved",
   *       "@context": [...],
   *       ...attributes
   *     }
   *   ]
   * }
   */
  @Post()
  @HttpCode(200)
  async handleNotification(@Body() notification: any) {
    try {
      const { subscriptionId, data, notifiedAt } = notification;

      this.logger.debug(
        `Received notification from subscription ${subscriptionId} with ${data?.length || 0} entities`,
      );

      if (!data || !Array.isArray(data) || data.length === 0) {
        this.logger.warn('Notification contains no data');
        return { success: true, message: 'No data to persist' };
      }

      // Process each entity in the notification
      const results = await this.persistenceService.persistEntities(
        data,
        notifiedAt,
      );

      this.logger.log(
        `Persisted ${results.success} entities, ${results.failed} failed`,
      );

      return {
        success: true,
        persisted: results.success,
        failed: results.failed,
        errors: results.errors,
      };
    } catch (error) {
      this.logger.error('Failed to handle notification', error.stack);

      // Return 200 to prevent Orion-LD from retrying
      // Log error for monitoring
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
