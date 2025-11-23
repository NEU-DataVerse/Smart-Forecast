import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirQualityController } from './air-quality.controller';
import { AirQualityService } from './air-quality.service';
import { AirQualityObservedEntity } from '../persistence/entities/air-quality-observed.entity';
import { IngestionModule } from '../ingestion/ingestion.module';

/**
 * Air Quality Module
 * Provides REST API for air quality data (current, forecast, historical)
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([AirQualityObservedEntity]),
    IngestionModule, // For OrionClientProvider
  ],
  controllers: [AirQualityController],
  providers: [AirQualityService],
  exports: [AirQualityService],
})
export class AirQualityModule {}
