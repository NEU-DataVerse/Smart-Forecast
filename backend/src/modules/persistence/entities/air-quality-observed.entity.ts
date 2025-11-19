import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

/**
 * Air Quality Observed Time-Series Entity
 *
 * Stores historical air quality observations from NGSI-LD
 * Partitioned by month for optimal time-series queries
 */
@Entity('air_quality_observed')
@Index(['entityId', 'recvTime'])
@Index(['recvTime'])
export class AirQualityObservedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 256 })
  entityId: string;

  @Column({ type: 'varchar', length: 100 })
  entityType: string;

  @Column({ type: 'timestamptz' })
  recvTime: Date;

  // Location data
  @Column({ type: 'varchar', length: 256, nullable: true })
  locationId: string;

  @Column({ type: 'json', nullable: true })
  location: any; // GeoJSON Point

  @Column({ type: 'varchar', length: 256, nullable: true })
  address: string;

  // Observed properties
  @Column({ type: 'timestamptz', nullable: true })
  dateObserved: Date;

  @Column({ type: 'float', nullable: true })
  co: number | null;

  @Column({ type: 'float', nullable: true })
  no: number | null;

  @Column({ type: 'float', nullable: true })
  no2: number | null;

  @Column({ type: 'float', nullable: true })
  o3: number | null;

  @Column({ type: 'float', nullable: true })
  so2: number | null;

  @Column({ type: 'float', nullable: true })
  pm25: number | null;

  @Column({ type: 'float', nullable: true })
  pm10: number | null;

  @Column({ type: 'float', nullable: true })
  nh3: number | null;

  @Column({ type: 'int', nullable: true })
  aqi: number | null;

  // Store full NGSI-LD entity for reference
  @Column({ type: 'jsonb' })
  rawEntity: any;
}
