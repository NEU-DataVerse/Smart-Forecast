import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { OrionClientProvider } from '../../ingestion/providers/orion-client.provider';

/**
 * Subscription Service
 * Manages NGSI-LD subscriptions for native persistence service
 * Auto-creates subscriptions on application startup
 */
@Injectable()
export class SubscriptionService implements OnModuleInit {
  private readonly logger = new Logger(SubscriptionService.name);
  private subscriptionIds: Map<string, string> = new Map();

  // Backend notification endpoint (Native persistence service)
  // Use host.docker.internal to allow Docker containers to reach host machine
  private readonly notificationEndpoint =
    'http://host.docker.internal:8000/api/v1/notify';

  // Entity types to subscribe (only observed data, not forecasts)
  private readonly entityTypes = ['AirQualityObserved', 'WeatherObserved'];

  constructor(private readonly orionClient: OrionClientProvider) {}

  /**
   * Lifecycle hook - Auto-create subscriptions on app startup
   */
  async onModuleInit() {
    this.logger.log('Initializing persistence subscriptions...');

    try {
      // Cleanup stale subscriptions first
      await this.cleanupStaleSubscriptions();

      // Create fresh subscriptions
      await this.createSubscriptions();

      this.logger.log(
        `Successfully initialized ${this.subscriptionIds.size} subscriptions`,
      );
    } catch (error) {
      this.logger.error(
        'Failed to initialize subscriptions',
        error.message,
        error.stack,
      );
      // Don't throw - allow app to start even if subscriptions fail
    }
  }

  /**
   * Delete all stale subscriptions from Orion-LD
   * Used to cleanup stale subscriptions before creating new ones
   */
  private async cleanupStaleSubscriptions(): Promise<void> {
    try {
      this.logger.debug('Checking for stale subscriptions...');

      const existingSubscriptions = await this.orionClient.getSubscriptions();

      // Filter subscriptions that point to our backend notification endpoint
      const staleSubscriptions = existingSubscriptions.filter((sub) =>
        sub.notification?.endpoint?.uri?.includes('8000/notify'),
      );

      if (staleSubscriptions.length === 0) {
        this.logger.debug('No stale subscriptions found');
        return;
      }

      this.logger.log(
        `Found ${staleSubscriptions.length} stale subscriptions, deleting...`,
      );

      // Delete all stale subscriptions
      for (const subscription of staleSubscriptions) {
        try {
          await this.orionClient.deleteSubscription(subscription.id);
          this.logger.debug(`Deleted stale subscription: ${subscription.id}`);
        } catch (error) {
          this.logger.warn(
            `Failed to delete subscription ${subscription.id}: ${error.message}`,
          );
        }
      }

      this.logger.log('Stale subscriptions cleanup completed');
    } catch (error) {
      this.logger.error('Failed to cleanup stale subscriptions', error.message);
      throw error;
    }
  }

  /**
   * Create subscriptions for all configured entity types
   */
  private async createSubscriptions(): Promise<void> {
    this.logger.log(
      `Creating subscriptions for ${this.entityTypes.length} entity types...`,
    );

    for (const entityType of this.entityTypes) {
      try {
        const subscriptionId = await this.createSubscription(entityType);
        this.subscriptionIds.set(entityType, subscriptionId);
        this.logger.log(
          `✓ Created subscription for ${entityType}: ${subscriptionId}`,
        );
      } catch (error) {
        this.logger.error(
          `✗ Failed to create subscription for ${entityType}`,
          error.message,
        );
        throw error;
      }
    }
  }

  /**
   * Create a single subscription for a specific entity type
   */
  private async createSubscription(entityType: string): Promise<string> {
    // Use appropriate context based on entity type
    const contextUrl =
      entityType === 'AirQualityObserved'
        ? 'https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld'
        : 'https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld';

    const subscription = {
      '@context': [
        'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld',
        contextUrl,
      ],
      type: 'Subscription',
      description: `Persistence subscription for ${entityType} - Auto-created by Smart Forecast`,
      entities: [
        {
          type: entityType,
        },
      ],
      notification: {
        format: 'normalized', // NGSI-LD normalized format
        endpoint: {
          uri: this.notificationEndpoint,
          accept: 'application/json',
        },
        // Notify on all attribute changes
        attributes: [],
      },
      // No expiration - subscription persists until deleted
      // expires: undefined
    };

    return await this.orionClient.createSubscription(subscription);
  }

  /**
   * Manually recreate all subscriptions
   * Useful for admin operations or recovery
   */
  async recreateSubscriptions(): Promise<{
    deleted: number;
    created: number;
  }> {
    this.logger.log('Manually recreating subscriptions...');

    // Clear old subscription IDs
    this.subscriptionIds.clear();

    // Cleanup and recreate
    await this.cleanupStaleSubscriptions();
    await this.createSubscriptions();

    return {
      deleted: this.entityTypes.length,
      created: this.subscriptionIds.size,
    };
  }

  /**
   * Get all active subscription IDs
   */
  getActiveSubscriptions(): Map<string, string> {
    return this.subscriptionIds;
  }

  /**
   * Get subscription details from Orion-LD
   */
  async getSubscriptionDetails(): Promise<any[]> {
    try {
      const allSubscriptions = await this.orionClient.getSubscriptions();

      // Filter only our persistence subscriptions
      return allSubscriptions.filter((sub) =>
        sub.notification?.endpoint?.uri?.includes('8000/notify'),
      );
    } catch (error) {
      this.logger.error('Failed to get subscription details', error.message);
      throw error;
    }
  }

  /**
   * Health check for subscriptions
   */
  async healthCheck(): Promise<{
    configured: number;
    active: number;
    healthy: boolean;
  }> {
    try {
      const details = await this.getSubscriptionDetails();

      return {
        configured: this.entityTypes.length,
        active: details.length,
        healthy: details.length === this.entityTypes.length,
      };
    } catch (error) {
      this.logger.error('Subscription health check failed', error.message);
      return {
        configured: this.entityTypes.length,
        active: 0,
        healthy: false,
      };
    }
  }
}
