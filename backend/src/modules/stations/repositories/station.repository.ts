import { Injectable } from '@nestjs/common';
import { DataSource, Repository, IsNull } from 'typeorm';
import { StationEntity } from '../entities/station.entity';
import { StationStatus, StationPriority } from '../dto/station.dto';

/**
 * Station Repository
 * Custom repository for station-specific queries
 */
@Injectable()
export class StationRepository extends Repository<StationEntity> {
  constructor(private dataSource: DataSource) {
    super(StationEntity, dataSource.createEntityManager());
  }

  /**
   * Find all active stations
   */
  async findActive(): Promise<StationEntity[]> {
    return this.find({
      where: { status: StationStatus.ACTIVE, deletedAt: IsNull() },
      order: { priority: 'DESC', name: 'ASC' },
    });
  }

  /**
   * Find stations by city
   */
  async findByCity(city: string): Promise<StationEntity[]> {
    return this.createQueryBuilder('station')
      .where('LOWER(station.city) = LOWER(:city)', { city })
      .andWhere('station.deletedAt IS NULL')
      .orderBy('station.name', 'ASC')
      .getMany();
  }

  /**
   * Find stations by district
   */
  async findByDistrict(district: string): Promise<StationEntity[]> {
    return this.createQueryBuilder('station')
      .where('LOWER(station.district) = LOWER(:district)', { district })
      .andWhere('station.deletedAt IS NULL')
      .orderBy('station.name', 'ASC')
      .getMany();
  }

  /**
   * Find station by unique code
   */
  async findByCode(code: string): Promise<StationEntity | null> {
    return this.findOne({
      where: { code, deletedAt: IsNull() },
    });
  }

  /**
   * Find stations with filters and pagination
   */
  async findWithFilters(filters: {
    city?: string;
    district?: string;
    status?: StationStatus;
    priority?: StationPriority;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<[StationEntity[], number]> {
    const query = this.createQueryBuilder('station').where(
      'station.deletedAt IS NULL',
    );

    if (filters.city) {
      query.andWhere('LOWER(station.city) = LOWER(:city)', {
        city: filters.city,
      });
    }

    if (filters.district) {
      query.andWhere('LOWER(station.district) = LOWER(:district)', {
        district: filters.district,
      });
    }

    if (filters.status) {
      query.andWhere('station.status = :status', { status: filters.status });
    }

    if (filters.priority) {
      query.andWhere('station.priority = :priority', {
        priority: filters.priority,
      });
    }

    if (filters.category) {
      query.andWhere(':category = ANY(station.categories)', {
        category: filters.category,
      });
    }

    // Pagination
    if (filters.offset) {
      query.skip(filters.offset);
    }

    if (filters.limit) {
      query.take(filters.limit);
    }

    query.orderBy('station.priority', 'DESC').addOrderBy('station.name', 'ASC');

    return query.getManyAndCount();
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
    const stations = await this.find({ where: { deletedAt: IsNull() } });

    const stats = {
      total: stations.length,
      active: 0,
      inactive: 0,
      maintenance: 0,
      retired: 0,
      byCity: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
    };

    for (const station of stations) {
      // Count by status
      if (station.status === StationStatus.ACTIVE) stats.active++;
      else if (station.status === StationStatus.INACTIVE) stats.inactive++;
      else if (station.status === StationStatus.MAINTENANCE)
        stats.maintenance++;
      else if (station.status === StationStatus.RETIRED) stats.retired++;

      // Count by city
      if (station.city) {
        stats.byCity[station.city] = (stats.byCity[station.city] || 0) + 1;
      }

      // Count by priority
      if (station.priority) {
        stats.byPriority[station.priority] =
          (stats.byPriority[station.priority] || 0) + 1;
      }
    }

    return stats;
  }

  /**
   * Soft delete station
   */
  async softDeleteStation(id: string): Promise<void> {
    await this.update(id, { deletedAt: new Date() });
  }

  /**
   * Restore soft deleted station
   */
  async restoreStation(id: string): Promise<void> {
    await this.update(id, { deletedAt: undefined });
  }

  /**
   * Find stations near a location (within radius in km)
   */
  async findNearby(
    lat: number,
    lon: number,
    radiusKm: number,
  ): Promise<StationEntity[]> {
    // Using Haversine formula for distance calculation
    return this.createQueryBuilder('station')
      .where('station.deletedAt IS NULL')
      .andWhere(
        `(
          6371 * acos(
            cos(radians(:lat)) * cos(radians((station.location->>'lat')::float)) *
            cos(radians((station.location->>'lon')::float) - radians(:lon)) +
            sin(radians(:lat)) * sin(radians((station.location->>'lat')::float))
          )
        ) <= :radius`,
        { lat, lon, radius: radiusKm },
      )
      .orderBy(
        `(
          6371 * acos(
            cos(radians(${lat})) * cos(radians((station.location->>'lat')::float)) *
            cos(radians((station.location->>'lon')::float) - radians(${lon})) +
            sin(radians(${lat})) * sin(radians((station.location->>'lat')::float))
          )
        )`,
      )
      .getMany();
  }
}
