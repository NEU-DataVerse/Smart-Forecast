import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

/**
 * Air Quality Forecast Time-Series Entity
 *
 * Stores forecast air quality predictions from NGSI-LD
 * Optimized for time-series queries
 */
@Entity('air_quality_forecast')
@Index(['validFrom'])
@Index(['locationId', 'validFrom'])
@Index(['entityId', 'validFrom'])
export class AirQualityForecastEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 256 })
  entityId: string;

  @Column({ type: 'varchar', length: 100 })
  entityType: string;

  @Column({ type: 'timestamptz' })
  recvTime: Date;

  // Forecast validity period
  @Column({ type: 'timestamptz' })
  validFrom: Date;

  @Column({ type: 'timestamptz' })
  validTo: Date;

  // Location data
  @Column({ type: 'varchar', length: 256, nullable: true })
  locationId: string;

  @Column({ type: 'json', nullable: true })
  location: any; // GeoJSON Point

  @Column({ type: 'varchar', length: 256, nullable: true })
  address: string;

  // Air Quality Index
  @Column({ type: 'int', nullable: true })
  airQualityIndex: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  airQualityLevel: string | null;

  // Pollutant forecasts (in µg/m³)
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

  // Store full NGSI-LD entity for reference
  @Column({ type: 'jsonb' })
  rawEntity: any;
}
