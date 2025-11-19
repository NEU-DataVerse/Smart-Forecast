import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionModule } from '../ingestion/ingestion.module';
import { SubscriptionService } from './services/subscription.service';
import { ForecastCleanupScheduler } from './schedulers/forecast-cleanup.scheduler';
import { PartitionManagementScheduler } from './schedulers/partition-management.scheduler';
import { CygnusController } from './cygnus.controller';

/**
 * Cygnus Module
 * Manages data persistence from Orion-LD to PostgreSQL via Cygnus
 * - Auto-creates NGSI-LD subscriptions for observed data
 * - Cleans up old forecast entities from Orion-LD
 * - Manages PostgreSQL table partitions for historical data
 * - Provides management endpoints for monitoring
 */
@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(), // Enable scheduling
    TypeOrmModule.forFeature([]), // Enable TypeORM for partition management
    IngestionModule, // Import to access OrionClientProvider
  ],
  controllers: [CygnusController],
  providers: [
    SubscriptionService,
    ForecastCleanupScheduler,
    PartitionManagementScheduler,
  ],
  exports: [SubscriptionService],
})
export class CygnusModule {}
