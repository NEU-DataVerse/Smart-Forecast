import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

/**
 * Weather Observed Time-Series Entity
 *
 * Stores historical weather observations from NGSI-LD
 * Partitioned by month for optimal time-series queries
 */
@Entity('weather_observed')
@Index(['entityId', 'recvTime'])
@Index(['recvTime'])
export class WeatherObservedEntity {
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
  temperature: number | null;

  @Column({ type: 'float', nullable: true })
  feelsLikeTemperature: number | null;

  @Column({ type: 'float', nullable: true })
  relativeHumidity: number | null;

  @Column({ type: 'float', nullable: true })
  atmosphericPressure: number | null;

  @Column({ type: 'float', nullable: true })
  windSpeed: number | null;

  @Column({ type: 'float', nullable: true })
  windDirection: number | null;

  @Column({ type: 'float', nullable: true })
  precipitation: number | null;

  @Column({ type: 'int', nullable: true })
  visibility: number | null;

  @Column({ type: 'int', nullable: true })
  weatherType: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  weatherDescription: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  weatherIcon: string;

  // Store full NGSI-LD entity for reference
  @Column({ type: 'jsonb' })
  rawEntity: any;
}
