import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

/**
 * Weather Forecast Time-Series Entity
 *
 * Stores forecast weather predictions from NGSI-LD
 * Optimized for time-series queries
 */
@Entity('weather_forecast')
@Index(['validFrom'])
@Index(['locationId', 'validFrom'])
@Index(['entityId', 'validFrom'])
export class WeatherForecastEntity {
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

  @Column({ type: 'timestamptz', nullable: true })
  dateIssued: Date;

  // Location data
  @Column({ type: 'varchar', length: 256, nullable: true })
  locationId: string;

  @Column({ type: 'json', nullable: true })
  location: any; // GeoJSON Point

  @Column({ type: 'varchar', length: 256, nullable: true })
  address: string;

  // Temperature forecasts (in Celsius)
  @Column({ type: 'float', nullable: true })
  tempDay: number | null;

  @Column({ type: 'float', nullable: true })
  tempMin: number | null;

  @Column({ type: 'float', nullable: true })
  tempMax: number | null;

  @Column({ type: 'float', nullable: true })
  tempNight: number | null;

  @Column({ type: 'float', nullable: true })
  tempEve: number | null;

  @Column({ type: 'float', nullable: true })
  tempMorn: number | null;

  // Feels-like temperature forecasts
  @Column({ type: 'float', nullable: true })
  feelsLikeDay: number | null;

  @Column({ type: 'float', nullable: true })
  feelsLikeNight: number | null;

  @Column({ type: 'float', nullable: true })
  feelsLikeEve: number | null;

  @Column({ type: 'float', nullable: true })
  feelsLikeMorn: number | null;

  // Weather conditions
  @Column({ type: 'float', nullable: true })
  pressure: number | null;

  @Column({ type: 'float', nullable: true })
  humidity: number | null;

  @Column({ type: 'float', nullable: true })
  windSpeed: number | null;

  @Column({ type: 'float', nullable: true })
  windDirection: number | null;

  @Column({ type: 'float', nullable: true })
  windGust: number | null;

  @Column({ type: 'int', nullable: true })
  clouds: number | null;

  @Column({ type: 'float', nullable: true })
  pop: number | null; // Probability of precipitation

  @Column({ type: 'float', nullable: true })
  precipitation: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  weatherType: string | null;

  @Column({ type: 'varchar', length: 256, nullable: true })
  weatherDescription: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  weatherIcon: string | null;

  // Store full NGSI-LD entity for reference
  @Column({ type: 'jsonb' })
  rawEntity: any;
}
