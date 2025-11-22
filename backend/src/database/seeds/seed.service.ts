import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StationEntity } from '../../modules/stations/entities/station.entity';
import { SEED_DATA } from './seed-data';

/**
 * SeedService - Handles database seeding operations
 *
 * This service is responsible for:
 * - Checking if the database already has data
 * - Inserting seed data if the database is empty
 * - Using TypeORM Repository for all database operations
 */
@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(StationEntity)
    private readonly stationRepository: Repository<StationEntity>,
  ) {}

  /**
   * Main method to run the seeding process
   *
   * Workflow:
   * 1. Check if the observation_station table has any data
   * 2. If empty, insert all data from SEED_DATA
   * 3. Log the results
   */
  async run(): Promise<void> {
    this.logger.log('Starting database seeding process...');

    try {
      // Step 1: Check if data already exists
      const count = await this.stationRepository.count();

      if (count > 0) {
        this.logger.log(
          `Database already contains ${count} stations. Skipping seed.`,
        );
        return;
      }

      this.logger.log('Database is empty. Starting to insert seed data...');

      // Step 2: Insert all seed data
      const stationData = SEED_DATA.stations.map((station) => ({
        id: station.id,
        type: station.type,
        code: station.code,
        name: station.name,
        status: station.status,
        city: station.city,
        district: station.district,
        ward: station.ward,
        location: { ...station.location },
        address: { ...station.address },
        timezone: station.timezone,
        timezoneOffset: station.timezoneOffset,
        priority: station.priority,
        categories: station.categories ? [...station.categories] : undefined,
        metadata: station.metadata ? { ...station.metadata } : undefined,
      }));

      // Create entities from the data
      const stations = this.stationRepository.create(stationData as any);

      // Save all stations in a single transaction
      const savedStations = await this.stationRepository.save(stations);

      this.logger.log(
        `Successfully seeded ${savedStations.length} stations into the database.`,
      );

      // Log some details
      savedStations.forEach((station) => {
        this.logger.debug(`  ✓ ${station.name} (${station.code})`);
      });

      this.logger.log('Seeding completed successfully!');
    } catch (error) {
      this.logger.error('Failed to seed database:', error);
      throw error;
    }
  }

  /**
   * Optional: Clear all stations from database
   * Use with caution - this will delete all data!
   */
  async clear(): Promise<void> {
    this.logger.warn('Clearing all stations from database...');

    try {
      await this.stationRepository.delete({});
      this.logger.log('All stations have been removed from database.');
    } catch (error) {
      this.logger.error('Failed to clear database:', error);
      throw error;
    }
  }

  /**
   * Optional: Re-seed database (clear and seed again)
   */
  async reseed(): Promise<void> {
    await this.clear();
    await this.run();
  }
}
