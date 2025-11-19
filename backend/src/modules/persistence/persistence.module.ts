import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersistenceController } from './persistence.controller';
import { PersistenceService } from './services/persistence.service';
import { AirQualityObservedEntity } from './entities/air-quality-observed.entity';
import { WeatherObservedEntity } from './entities/weather-observed.entity';

/**
 * Persistence Module
 *
 * Handles NGSI-LD notification persistence to PostgreSQL
 * Replaces Cygnus with native NestJS implementation
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([AirQualityObservedEntity, WeatherObservedEntity]),
  ],
  controllers: [PersistenceController],
  providers: [PersistenceService],
  exports: [PersistenceService],
})
export class PersistenceModule {}
