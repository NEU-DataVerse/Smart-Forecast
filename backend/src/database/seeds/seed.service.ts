import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Entities
import { User } from '../../modules/user/entities/user.entity';
import { StationEntity } from '../../modules/stations/entities/station.entity';
import { WeatherObservedEntity } from '../../modules/persistence/entities/weather-observed.entity';
import { AirQualityObservedEntity } from '../../modules/persistence/entities/air-quality-observed.entity';
import { IncidentEntity } from '../../modules/incident/entities/incident.entity';
import { AlertEntity } from '../../modules/alert/entities/alert.entity';

// Seed Data
import {
  USER_SEED_DATA,
  STATION_SEED_DATA,
  INCIDENT_SEED_DATA,
  ALERT_SEED_DATA,
  generateWeatherSeedData,
  generateAirQualitySeedData,
} from './data';

/**
 * SeedService - Handles database seeding operations
 *
 * This service is responsible for:
 * - Clearing all data from database (TRUNCATE CASCADE)
 * - Seeding sample data for all 6 tables
 * - Maintaining correct order for foreign key constraints
 *
 * Tables seeded:
 * 1. users - User accounts (admin, test users)
 * 2. observation_station - Weather/Air quality monitoring stations
 * 3. weather_observed - Historical weather data
 * 4. air_quality_observed - Historical air quality data
 * 5. incidents - Citizen incident reports
 * 6. alerts - Environmental alerts
 */
@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(StationEntity)
    private readonly stationRepository: Repository<StationEntity>,
    @InjectRepository(WeatherObservedEntity)
    private readonly weatherRepository: Repository<WeatherObservedEntity>,
    @InjectRepository(AirQualityObservedEntity)
    private readonly airQualityRepository: Repository<AirQualityObservedEntity>,
    @InjectRepository(IncidentEntity)
    private readonly incidentRepository: Repository<IncidentEntity>,
    @InjectRepository(AlertEntity)
    private readonly alertRepository: Repository<AlertEntity>,
  ) {}

  /**
   * Main method to run the seeding process
   *
   * @param force - If true, clear all data before seeding
   */
  async run(force = false): Promise<void> {
    this.logger.log('🌱 Starting database seeding process...');

    try {
      if (force) {
        await this.clearAll();
      }

      // Check if data already exists
      const userCount = await this.userRepository.count();
      if (userCount > 0 && !force) {
        this.logger.log(
          `Database already contains data. Use --force to reseed.`,
        );
        return;
      }

      // Seed in order (respecting foreign key constraints)
      await this.seedUsers();
      await this.seedStations();
      await this.seedWeather();
      await this.seedAirQuality();
      await this.seedIncidents();
      await this.seedAlerts();

      this.logger.log('✅ Seeding completed successfully!');
    } catch (error) {
      this.logger.error('❌ Failed to seed database:', error);
      throw error;
    }
  }

  /**
   * Clear all data from database using TRUNCATE CASCADE
   */
  async clearAll(): Promise<void> {
    this.logger.warn('🗑️  Clearing all data from database...');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Disable foreign key checks temporarily
      await queryRunner.query('SET session_replication_role = replica;');

      // Truncate all tables in reverse order of dependencies
      const tables = [
        'alerts',
        'incidents',
        'air_quality_observed',
        'weather_observed',
        'observation_station',
        'users',
      ];

      for (const table of tables) {
        await queryRunner.query(`TRUNCATE TABLE "${table}" CASCADE;`);
        this.logger.debug(`  ✓ Truncated ${table}`);
      }

      // Re-enable foreign key checks
      await queryRunner.query('SET session_replication_role = DEFAULT;');

      this.logger.log('✅ All tables cleared successfully!');
    } catch (error) {
      this.logger.error('Failed to clear database:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Seed Users table
   */
  private async seedUsers(): Promise<void> {
    this.logger.log('📝 Seeding users...');

    for (const userData of USER_SEED_DATA) {
      // Hash password manually before insert (bypass @BeforeInsert since we use insert())
      let hashedPassword: string | undefined;
      if (userData.password) {
        hashedPassword = await bcrypt.hash(userData.password, 10);
      }

      // Use insert() to bypass @BeforeInsert hook (which would double-hash password)
      await this.userRepository.insert({
        id: userData.id,
        email: userData.email,
        password: hashedPassword,
        fullName: userData.fullName,
        role: userData.role,
        provider: userData.provider,
        googleId: userData.googleId,
        phoneNumber: userData.phoneNumber,
        emailVerified: userData.emailVerified,
        isActive: userData.isActive,
      });
    }

    this.logger.log(`  ✓ Seeded ${USER_SEED_DATA.length} users`);

    // Log user credentials for dev reference
    USER_SEED_DATA.filter((u) => u.password).forEach((u) => {
      this.logger.debug(`    - ${u.email} / ${u.password}`);
    });
  }

  /**
   * Seed Stations table
   */
  private async seedStations(): Promise<void> {
    this.logger.log('🏢 Seeding stations...');

    for (const data of STATION_SEED_DATA) {
      const station = this.stationRepository.create(data as any);
      await this.stationRepository.save(station);
    }

    this.logger.log(`  ✓ Seeded ${STATION_SEED_DATA.length} stations`);
  }

  /**
   * Seed Weather Observed table
   */
  private async seedWeather(): Promise<void> {
    this.logger.log('🌤️  Seeding weather data...');

    const weatherData = generateWeatherSeedData();

    // Insert in batches for better performance
    const batchSize = 100;
    for (let i = 0; i < weatherData.length; i += batchSize) {
      const batch = weatherData.slice(i, i + batchSize);
      await this.weatherRepository.insert(batch as any);
    }

    this.logger.log(`  ✓ Seeded ${weatherData.length} weather records`);
  }

  /**
   * Seed Air Quality Observed table
   */
  private async seedAirQuality(): Promise<void> {
    this.logger.log('💨 Seeding air quality data...');

    const airQualityData = generateAirQualitySeedData();

    // Insert in batches for better performance
    const batchSize = 100;
    for (let i = 0; i < airQualityData.length; i += batchSize) {
      const batch = airQualityData.slice(i, i + batchSize);
      await this.airQualityRepository.insert(batch as any);
    }

    this.logger.log(`  ✓ Seeded ${airQualityData.length} air quality records`);
  }

  /**
   * Seed Incidents table
   */
  private async seedIncidents(): Promise<void> {
    this.logger.log('🚨 Seeding incidents...');

    for (const data of INCIDENT_SEED_DATA) {
      const incident = this.incidentRepository.create(data as any);
      await this.incidentRepository.save(incident);
    }

    this.logger.log(`  ✓ Seeded ${INCIDENT_SEED_DATA.length} incidents`);
  }

  /**
   * Seed Alerts table
   */
  private async seedAlerts(): Promise<void> {
    this.logger.log('🔔 Seeding alerts...');

    for (const data of ALERT_SEED_DATA) {
      const alert = this.alertRepository.create(data as any);
      await this.alertRepository.save(alert);
    }

    this.logger.log(`  ✓ Seeded ${ALERT_SEED_DATA.length} alerts`);
  }

  /**
   * Alias for clearAll + run
   */
  async reseed(): Promise<void> {
    await this.run(true);
  }

  /**
   * Alias for clearAll
   */
  async clear(): Promise<void> {
    await this.clearAll();
  }
}
