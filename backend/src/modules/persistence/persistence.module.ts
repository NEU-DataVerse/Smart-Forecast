import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersistenceController } from './persistence.controller';
import { PersistenceService } from './services/persistence.service';
import { SubscriptionService } from './services/subscription.service';
import { AirQualityObservedEntity } from './entities/air-quality-observed.entity';
import { WeatherObservedEntity } from './entities/weather-observed.entity';
import { IngestionModule } from '../ingestion/ingestion.module';

/**
 * Persistence Module
 *
 * Handles NGSI-LD notification persistence to PostgreSQL
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([AirQualityObservedEntity, WeatherObservedEntity]),
    IngestionModule,
  ],
  controllers: [PersistenceController],
  providers: [PersistenceService, SubscriptionService],
  exports: [PersistenceService],
})
export class PersistenceModule {}
