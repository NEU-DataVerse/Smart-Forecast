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
@Index(['locationId', 'dateObserved'])
@Index(['dateObserved'])
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

  @Column({ type: 'varchar', length: 50, nullable: true })
  weatherType: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  weatherDescription: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  weatherIconCode: string;

  @Column({ type: 'int', nullable: true })
  cloudiness: number | null;

  @Column({ type: 'float', nullable: true })
  temperatureMin: number | null;

  @Column({ type: 'float', nullable: true })
  temperatureMax: number | null;

  @Column({ type: 'float', nullable: true })
  pressureSeaLevel: number | null;

  @Column({ type: 'float', nullable: true })
  pressureGroundLevel: number | null;

  @Column({ type: 'float', nullable: true })
  windGust: number | null;

  @Column({ type: 'timestamptz', nullable: true })
  sunrise: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  sunset: Date | null;

  @Column({ type: 'int', nullable: true })
  timezone: number | null;

  // Store full NGSI-LD entity for reference
  @Column({ type: 'jsonb' })
  rawEntity: any;
}
