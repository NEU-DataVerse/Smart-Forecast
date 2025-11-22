import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { StationEntity } from '../../modules/stations/entities/station.entity';
import { SeedService } from './seed.service';
import databaseConfig from '../../config/database.config';

/**
 * SeedModule - Module for database seeding
 *
 * This module:
 * - Imports ConfigModule for environment variables
 * - Imports TypeOrmModule with database configuration
 * - Registers StationEntity for TypeORM repository
 * - Provides SeedService for seeding operations
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

    // Register entities that need to be seeded
    TypeOrmModule.forFeature([StationEntity]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
