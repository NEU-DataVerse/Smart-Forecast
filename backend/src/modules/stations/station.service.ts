import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IsNull } from 'typeorm';
import { StationRepository } from './repositories/station.repository';
import { StationEntity } from './entities/station.entity';
import {
  CreateStationDto,
  UpdateStationDto,
  StationQueryDto,
  StationStatus,
  StationPriority,
} from './dto/station.dto';

// Constants
const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh';
const DEFAULT_TIMEZONE_OFFSET = 25200;
const EARTH_RADIUS_KM = 6371;

/**
 * Station Service
 * Manages weather stations with PostgreSQL persistence
 */
@Injectable()
export class StationService {
  private readonly logger = new Logger(StationService.name);

  constructor(private readonly stationRepository: StationRepository) {}

  /** Generate station code from city + UUID */
  private generateStationCode(city?: string): string {
    const cityPrefix = city ? this.normalizeString(city) : 'unknown';
    const uuid = randomUUID().split('-')[0];
    return `${cityPrefix}-${uuid}`;
  }

  /** Generate station ID in URN format */
  private generateStationId(code: string): string {
    return `urn:ngsi-ld:ObservationStation:${code}`;
  }

  /** Normalize string (remove Vietnamese diacritics, convert to kebab-case) */
  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /** Convert degrees to radians */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /** Calculate distance between two coordinates using Haversine formula */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(EARTH_RADIUS_KM * c * 100) / 100;
  }

  /** Get all stations with optional status filter and pagination */
  async findAll(query?: StationQueryDto): Promise<StationEntity[]> {
    const queryBuilder = this.stationRepository
      .createQueryBuilder('station')
      .where('station.deletedAt IS NULL');

    if (query?.status) {
      queryBuilder.andWhere('station.status = :status', {
        status: query.status,
      });
    }

    if (query?.offset) {
      queryBuilder.skip(query.offset);
    }

    if (query?.limit) {
      queryBuilder.take(query.limit);
    }

    return queryBuilder
      .orderBy('station.priority', 'DESC')
      .addOrderBy('station.name', 'ASC')
      .getMany();
  }

  /** Get station by ID */
  async findById(id: string): Promise<StationEntity> {
    const station = await this.stationRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!station) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }

    return station;
  }

  /** Get station by code */
  async findByCode(code: string): Promise<StationEntity> {
    const station = await this.stationRepository.findByCode(code);

    if (!station) {
      throw new NotFoundException(`Station with code ${code} not found`);
    }

    return station;
  }

  /**
   * Find nearest station(s) based on GPS coordinates
   * @param lat Latitude
   * @param lon Longitude
   * @param radius Search radius in kilometers (default: 50km)
   * @param limit Maximum number of stations to return (default: 1)
   */
  async findNearest(
    lat: number,
    lon: number,
    radius = 50,
    limit = 1,
  ): Promise<Array<StationEntity & { distance: number }>> {
    const stations = await this.findAll({ status: StationStatus.ACTIVE });

    if (stations.length === 0) return [];

    return stations
      .map((station) => ({
        ...station,
        distance: this.calculateDistance(
          lat,
          lon,
          station.location.lat,
          station.location.lon,
        ),
      }))
      .filter((s) => s.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  }

  /** Create a new station */
  async create(createDto: CreateStationDto): Promise<StationEntity> {
    const code = this.generateStationCode(createDto.city);
    const id = this.generateStationId(code);

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
      timezone: createDto.timezone || DEFAULT_TIMEZONE,
      timezoneOffset: DEFAULT_TIMEZONE_OFFSET,
      priority: createDto.priority || StationPriority.MEDIUM,
      categories: createDto.categories || [],
      metadata: {
        ...createDto.metadata,
        installationDate: new Date().toISOString(),
      },
    });

    await this.stationRepository.save(newStation);
    this.logger.log(`Created station: ${newStation.name} (${id})`);
    return newStation;
  }

  /** Update a station */
  async update(
    id: string,
    updateDto: UpdateStationDto,
  ): Promise<StationEntity> {
    const station = await this.findById(id);

    Object.assign(station, {
      ...updateDto,
      id: station.id,
      code: station.code,
    });

    await this.stationRepository.save(station);
    this.logger.log(`Updated station: ${station.name} (${id})`);
    return station;
  }

  /** Delete a station (soft delete) */
  async delete(id: string): Promise<void> {
    const station = await this.findById(id);
    await this.stationRepository.softDeleteStation(id);
    this.logger.log(`Deleted station: ${station.name} (${id})`);
  }

  /** Activate a station */
  async activate(id: string): Promise<StationEntity> {
    return this.update(id, { status: StationStatus.ACTIVE });
  }

  /** Deactivate a station */
  async deactivate(id: string): Promise<StationEntity> {
    return this.update(id, { status: StationStatus.INACTIVE });
  }

  /** Set station to maintenance mode */
  async setMaintenance(id: string): Promise<StationEntity> {
    return this.update(id, { status: StationStatus.MAINTENANCE });
  }

  /** Get station statistics by status */
  async getStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    maintenance: number;
  }> {
    const allStations = await this.stationRepository
      .createQueryBuilder('station')
      .where('station.deletedAt IS NULL')
      .getMany();

    return {
      total: allStations.length,
      active: allStations.filter((s) => s.status === StationStatus.ACTIVE)
        .length,
      inactive: allStations.filter((s) => s.status === StationStatus.INACTIVE)
        .length,
      maintenance: allStations.filter(
        (s) => s.status === StationStatus.MAINTENANCE,
      ).length,
    };
  }
}
