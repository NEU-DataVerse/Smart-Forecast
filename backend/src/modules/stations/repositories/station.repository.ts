import { Injectable } from '@nestjs/common';
import { DataSource, Repository, IsNull } from 'typeorm';
import { StationEntity } from '../entities/station.entity';

/**
 * Station Repository
 * Custom repository for station-specific queries
 */
@Injectable()
export class StationRepository extends Repository<StationEntity> {
  constructor(private dataSource: DataSource) {
    super(StationEntity, dataSource.createEntityManager());
  }

  /** Find station by unique code */
  async findByCode(code: string): Promise<StationEntity | null> {
    return this.findOne({
      where: { code, deletedAt: IsNull() },
    });
  }

  /** Soft delete station */
  async softDeleteStation(id: string): Promise<void> {
    await this.update(id, { deletedAt: new Date() });
  }

  /** Restore soft deleted station */
  async restoreStation(id: string): Promise<void> {
    await this.update(id, { deletedAt: undefined });
  }

  /** Find stations near a location (within radius in km) using Haversine formula */
  async findNearby(
    lat: number,
    lon: number,
    radiusKm: number,
  ): Promise<StationEntity[]> {
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
