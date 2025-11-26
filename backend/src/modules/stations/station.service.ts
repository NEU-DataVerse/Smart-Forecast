import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { StationRepository } from './repositories/station.repository';
import { StationEntity } from './entities/station.entity';
import {
  CreateStationDto,
  UpdateStationDto,
  StationQueryDto,
  StationStatus,
  StationPriority,
} from './dto/station.dto';

/**
 * Station Service
 * Manages weather stations with PostgreSQL persistence
 * Provides CRUD operations and querying capabilities
 */
@Injectable()
export class StationService {
  private readonly logger = new Logger(StationService.name);

  constructor(private readonly stationRepository: StationRepository) {
    this.logger.log('StationService initialized with PostgreSQL repository');
  }

  /**
   * Generate station code from city + UUID
   * @param city City name
   * @returns Station code in format: City-UUID
   */
  private generateStationCode(city?: string): string {
    const cityPrefix = city ? this.normalizeString(city) : 'Unknown';
    const uuid = randomUUID().split('-')[0]; // Use first segment of UUID
    return `${cityPrefix}-${uuid}`;
  }

  /**
   * Generate station ID from code
   * @param code Station code
   * @returns Station ID in URN format
   */
  private generateStationId(code: string): string {
    return `urn:ngsi-ld:ObservationStation:${code}`;
  }

  /**
   * Normalize string (remove Vietnamese diacritics, convert to kebab-case)
   * @param str Input string
   * @returns Normalized string
   */
  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Get all stations with optional filtering
   */
  async findAll(query?: StationQueryDto): Promise<StationEntity[]> {
    if (!query || Object.keys(query).length === 0) {
      return this.stationRepository.find({
        where: { deletedAt: undefined },
        order: { name: 'ASC' },
      });
    }

    const [stations] = await this.stationRepository.findWithFilters({
      city: query.city,
      district: query.district,
      status: query.status,
      priority: query.priority,
      category: query.category,
      limit: query.limit,
      offset: query.offset,
    });

    return stations;
  }

  /**
   * Get active stations only (for ingestion)
   */
  async findActive(): Promise<StationEntity[]> {
    return this.stationRepository.findActive();
  }

  /**
   * Get station by ID
   */
  async findById(id: string): Promise<StationEntity> {
    const station = await this.stationRepository.findOne({
      where: { id, deletedAt: undefined },
    });

    if (!station) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }

    return station;
  }

  /**
   * Get station by code
   */
  async findByCode(code: string): Promise<StationEntity> {
    const station = await this.stationRepository.findByCode(code);

    if (!station) {
      throw new NotFoundException(`Station with code ${code} not found`);
    }

    return station;
  }

  /**
   * Get stations by city
   */
  async findByCity(city: string): Promise<StationEntity[]> {
    return this.stationRepository.findByCity(city);
  }

  /**
   * Get stations by district
   */
  async findByDistrict(district: string): Promise<StationEntity[]> {
    return this.stationRepository.findByDistrict(district);
  }

  /**
   * Find nearest station(s) based on GPS coordinates
   * Uses Haversine formula to calculate distance
   * @param lat Latitude
   * @param lon Longitude
   * @param radius Search radius in kilometers (default: 50km)
   * @param limit Maximum number of stations to return (default: 1)
   */
  async findNearest(
    lat: number,
    lon: number,
    radius: number = 50,
    limit: number = 1,
  ): Promise<Array<StationEntity & { distance: number }>> {
    // Get all active stations
    const stations = await this.findActive();

    if (stations.length === 0) {
      return [];
    }

    // Calculate distance for each station using Haversine formula
    const stationsWithDistance = stations.map((station) => {
      const distance = this.calculateDistance(
        lat,
        lon,
        station.location.lat,
        station.location.lon,
      );
      return { ...station, distance };
    });

    // Filter by radius and sort by distance
    const nearbyStations = stationsWithDistance
      .filter((s) => s.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    if (nearbyStations.length === 0) {
      this.logger.warn(
        `No stations found within ${radius}km of coordinates (${lat}, ${lon})`,
      );
    } else {
      this.logger.log(
        `Found ${nearbyStations.length} station(s) within ${radius}km`,
      );
    }

    return nearbyStations;
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @param lat1 Latitude of first point
   * @param lon1 Longitude of first point
   * @param lat2 Latitude of second point
   * @param lon2 Longitude of second point
   * @returns Distance in kilometers
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Create a new station
   */
  async create(createDto: CreateStationDto): Promise<StationEntity> {
    // Generate code and ID
    const code = this.generateStationCode(createDto.city);
    const id = this.generateStationId(code);

    // Check for duplicates
    const existing = await this.stationRepository.findByCode(code);
    if (existing) {
      throw new Error(`Station with code ${code} already exists`);
    }

    const newStation = this.stationRepository.create({
      id,
      type: 'ObservationStation',
      code,
      name: createDto.name,
      status: StationStatus.ACTIVE,
      city: createDto.city,
      district: createDto.district,
      ward: createDto.ward,
      location: createDto.location,
      address: createDto.address,
      timezone: createDto.timezone || 'Asia/Ho_Chi_Minh',
      timezoneOffset: 25200,
      priority: createDto.priority || StationPriority.MEDIUM,
      categories: createDto.categories || [],
      metadata: {
        ...createDto.metadata,
        installationDate: new Date().toISOString(),
      },
    });

    await this.stationRepository.save(newStation);

    this.logger.log(`Created new station: ${newStation.name} (${id})`);
    return newStation;
  }

  /**
   * Update a station
   */
  async update(
    id: string,
    updateDto: UpdateStationDto,
  ): Promise<StationEntity> {
    const station = await this.findById(id);

    // Merge updates
    Object.assign(station, {
      ...updateDto,
      id: station.id, // Preserve ID
      code: station.code, // Preserve code
    });

    await this.stationRepository.save(station);

    this.logger.log(`Updated station: ${station.name} (${id})`);
    return station;
  }

  /**
   * Delete a station
   */
  async delete(id: string): Promise<void> {
    const station = await this.findById(id);
    await this.stationRepository.softDeleteStation(id);

    this.logger.log(`Deleted station: ${station.name} (${id})`);
  }

  /**
   * Activate a station
   */
  async activate(id: string): Promise<StationEntity> {
    return this.update(id, { status: StationStatus.ACTIVE });
  }

  /**
   * Deactivate a station
   */
  async deactivate(id: string): Promise<StationEntity> {
    return this.update(id, { status: StationStatus.INACTIVE });
  }

  /**
   * Batch activate stations
   */
  async batchActivate(
    ids: string[],
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const id of ids) {
      try {
        await this.activate(id);
        success++;
      } catch (error) {
        failed++;
        this.logger.error(`Failed to activate station ${id}`, error.message);
      }
    }

    return { success, failed };
  }

  /**
   * Batch deactivate stations
   */
  async batchDeactivate(
    ids: string[],
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const id of ids) {
      try {
        await this.deactivate(id);
        success++;
      } catch (error) {
        failed++;
        this.logger.error(`Failed to deactivate station ${id}`, error.message);
      }
    }

    return { success, failed };
  }

  /**
   * Get station statistics
   */
  async getStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    maintenance: number;
    retired: number;
    byCity: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    return this.stationRepository.getStatistics();
  }

  /**
   * Get data source info
   */
  async getDataSourceInfo(): Promise<{
    source: string;
    lastUpdated: string;
    stationCount: number;
  }> {
    const stats = await this.stationRepository.getStatistics();
    return {
      source: 'PostgreSQL',
      lastUpdated: new Date().toISOString(),
      stationCount: stats.total,
    };
  }
}
