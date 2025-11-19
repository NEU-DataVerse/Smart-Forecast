import { Controller, Get, Post, Logger } from '@nestjs/common';
import { SubscriptionService } from './services/subscription.service';
import { ForecastCleanupScheduler } from './schedulers/forecast-cleanup.scheduler';
import { PartitionManagementScheduler } from './schedulers/partition-management.scheduler';
import axios from 'axios';

/**
 * Cygnus Controller
 * Provides management endpoints for Cygnus subscriptions and data persistence
 */
@Controller('cygnus')
export class CygnusController {
  private readonly logger = new Logger(CygnusController.name);

  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly forecastCleanup: ForecastCleanupScheduler,
    private readonly partitionManagement: PartitionManagementScheduler,
  ) {}

  /**
   * Get all active Cygnus subscriptions
   * GET /cygnus/subscriptions
   */
  @Get('subscriptions')
  async getSubscriptions() {
    try {
      const activeSubscriptions =
        this.subscriptionService.getActiveSubscriptions();
      const details = await this.subscriptionService.getSubscriptionDetails();

      return {
        success: true,
        count: details.length,
        subscriptions: details,
        activeIds: Object.fromEntries(activeSubscriptions),
      };
    } catch (error) {
      this.logger.error('Failed to get subscriptions', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Recreate all Cygnus subscriptions
   * POST /cygnus/subscriptions/recreate
   */
  @Post('subscriptions/recreate')
  async recreateSubscriptions() {
    try {
      this.logger.log('Manual subscription recreation triggered');

      const result = await this.subscriptionService.recreateSubscriptions();

      return {
        success: true,
        message: 'Subscriptions recreated successfully',
        ...result,
      };
    } catch (error) {
      this.logger.error('Failed to recreate subscriptions', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Health check for Cygnus service
   * GET /cygnus/health
   */
  @Get('health')
  async healthCheck() {
    try {
      // Check Cygnus API
      const cygnusHealthy = await this.checkCygnusHealth();

      // Check subscriptions
      const subscriptionHealth = await this.subscriptionService.healthCheck();

      const overallHealthy = cygnusHealthy && subscriptionHealth.healthy;

      return {
        success: true,
        healthy: overallHealthy,
        cygnus: {
          healthy: cygnusHealthy,
          endpoint: 'http://cygnus:5080',
        },
        subscriptions: subscriptionHealth,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Health check failed', error.message);
      return {
        success: false,
        healthy: false,
        error: error.message,
      };
    }
  }

  /**
   * Get statistics about Cygnus data persistence
   * GET /cygnus/stats
   */
  @Get('stats')
  async getStats() {
    try {
      // Try to get stats from Cygnus API
      const cygnusStats = await this.getCygnusStats();

      const subscriptionHealth = await this.subscriptionService.healthCheck();

      return {
        success: true,
        subscriptions: subscriptionHealth,
        cygnus: cygnusStats,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Failed to get stats', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Manually trigger forecast cleanup
   * POST /cygnus/cleanup/forecast
   */
  @Post('cleanup/forecast')
  async triggerForecastCleanup() {
    try {
      this.logger.log('Manual forecast cleanup triggered');

      const result = await this.forecastCleanup.triggerCleanup();

      return {
        success: true,
        message: 'Forecast cleanup completed',
        ...result,
      };
    } catch (error) {
      this.logger.error('Failed to trigger forecast cleanup', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Manually trigger partition management
   * POST /cygnus/partitions/manage
   */
  @Post('partitions/manage')
  async triggerPartitionManagement() {
    try {
      this.logger.log('Manual partition management triggered');

      const result =
        await this.partitionManagement.triggerPartitionManagement();

      return result;
    } catch (error) {
      this.logger.error(
        'Failed to trigger partition management',
        error.message,
      );
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get partition information
   * GET /cygnus/partitions
   */
  @Get('partitions')
  async getPartitions() {
    try {
      const info = await this.partitionManagement.getPartitionInfo();

      return {
        success: true,
        partitions: info,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Failed to get partition info', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Check if Cygnus service is healthy
   */
  private async checkCygnusHealth(): Promise<boolean> {
    try {
      const response = await axios.get('http://cygnus:5080/v1/version', {
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      this.logger.warn('Cygnus health check failed', error.message);
      return false;
    }
  }

  /**
   * Get statistics from Cygnus API
   */
  private async getCygnusStats(): Promise<any> {
    try {
      const response = await axios.get('http://cygnus:5080/v1/stats', {
        timeout: 5000,
      });
      return response.data;
    } catch (error) {
      this.logger.warn('Failed to get Cygnus stats', error.message);
      return null;
    }
  }
}
