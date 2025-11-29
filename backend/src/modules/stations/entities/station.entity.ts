import {
  Entity,
  Column,
  PrimaryColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StationStatus, StationPriority } from '../dto/station.dto';

/**
 * Station Entity for PostgreSQL
 * Maps to the observation_station table
 */
@Entity('observation_station')
@Index(['city', 'district'])
@Index(['status'])
export class StationEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Column({ type: 'varchar', length: 50, default: 'ObservationStation' })
  type: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: StationStatus,
    default: StationStatus.ACTIVE,
  })
  status: StationStatus;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Index()
  city: string;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  district: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ward?: string;

  // Store location as JSONB for efficient querying
  @Column({ type: 'jsonb' })
  location: {
    lat: number;
    lon: number;
    altitude?: number;
  };

  // Store address as JSONB
  @Column({ type: 'jsonb' })
  address: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion?: string;
    addressCountry: string;
    postalCode?: string;
  };

  @Column({ type: 'varchar', length: 50, default: 'Asia/Ho_Chi_Minh' })
  timezone: string;

  @Column({ type: 'int', default: 25200 })
  timezoneOffset?: number;

  @Column({
    type: 'enum',
    enum: StationPriority,
    default: StationPriority.MEDIUM,
    nullable: true,
  })
  priority?: StationPriority;

  @Column({ type: 'simple-array', nullable: true })
  categories?: string[];

  // Store metadata as JSONB for flexibility
  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    installationDate?: string;
    operator?: string;
    contact?: string;
    description?: string;
    [key: string]: any;
  };

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  deletedAt?: Date;
}
