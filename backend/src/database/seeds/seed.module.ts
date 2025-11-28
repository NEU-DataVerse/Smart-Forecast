import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Entities
import { User } from '../../modules/user/entities/user.entity';
import { StationEntity } from '../../modules/stations/entities/station.entity';
import { WeatherObservedEntity } from '../../modules/persistence/entities/weather-observed.entity';
import { AirQualityObservedEntity } from '../../modules/persistence/entities/air-quality-observed.entity';
import { IncidentEntity } from '../../modules/incident/entities/incident.entity';
import { AlertEntity } from '../../modules/alert/entities/alert.entity';

// Config
import databaseConfig from '../../config/database.config';

// Service
import { SeedService } from './seed.service';

/**
 * SeedModule - Module for database seeding
 *
 * This module:
 * - Imports ConfigModule for environment variables
 * - Imports TypeOrmModule with database configuration
 * - Registers all entities for TypeORM repository
 * - Provides SeedService for seeding operations
 *
 * Entities seeded:
 * - User (users table)
 * - StationEntity (observation_station table)
 * - WeatherObservedEntity (weather_observed table)
 * - AirQualityObservedEntity (air_quality_observed table)
 * - IncidentEntity (incidents table)
 * - AlertEntity (alerts table)
 */
@Module({
  imports: [
    // Import ConfigModule to load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),

    // Import TypeOrmModule with database configuration
    TypeOrmModule.forRootAsync({
      useFactory: () => databaseConfig(),
    }),

    // Register all entities that need to be seeded
    TypeOrmModule.forFeature([
      User,
      StationEntity,
      WeatherObservedEntity,
      AirQualityObservedEntity,
      IncidentEntity,
      AlertEntity,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
