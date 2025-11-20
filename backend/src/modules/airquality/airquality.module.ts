import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirQualityController } from './airquality.controller';
import { AirQualityService } from './airquality.service';
import { AirQualityObservedEntity } from '../persistence/entities/air-quality-observed.entity';
import { AirQualityForecastEntity } from '../persistence/entities/air-quality-forecast.entity';
import { StationsModule } from '../stations/stations.module';
import { IngestionModule } from '../ingestion/ingestion.module';

/**
 * Air Quality Module
 *
 * Provides air quality data APIs for admin dashboard
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      AirQualityObservedEntity,
      AirQualityForecastEntity,
    ]),
    StationsModule,
    IngestionModule,
  ],
  controllers: [AirQualityController],
  providers: [AirQualityService],
  exports: [AirQualityService],
})
export class AirQualityModule {}
