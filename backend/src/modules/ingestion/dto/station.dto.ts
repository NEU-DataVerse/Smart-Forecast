/**
 * Station DTOs for Weather Station Management
 */

export interface StationLocation {
  lat: number;
  lon: number;
  altitude?: number;
}

export interface StationAddress {
  streetAddress?: string;
  addressLocality: string;
  addressRegion?: string;
  addressCountry: string;
  postalCode?: string;
}

export interface StationMetadata {
  installationDate?: string;
  operator?: string;
  contact?: string;
  description?: string;
  [key: string]: any;
}

export enum StationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  RETIRED = 'retired',
}

export enum StationPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export interface WeatherStation {
  id: string;
  type: string;
  name: string;
  code?: string;
  status: StationStatus;
  city?: string;
  district: string;
  ward?: string;
  location: StationLocation;
  address: StationAddress;
  timezone: string;
  timezoneOffset?: number;
  priority?: StationPriority;
  categories?: string[];
  metadata?: StationMetadata;
}

export interface StationDataSource {
  version: string;
  lastUpdated: string;
  stations: WeatherStation[];
}

/**
 * DTO for creating a new station
 */
export class CreateStationDto {
  name: string;
  code?: string;
  city?: string;
  district: string;
  ward?: string;
  location: StationLocation;
  address: StationAddress;
  timezone?: string;
  priority?: StationPriority;
  categories?: string[];
  metadata?: StationMetadata;
}

/**
 * DTO for updating a station
 */
export class UpdateStationDto {
  name?: string;
  code?: string;
  status?: StationStatus;
  city?: string;
  district?: string;
  ward?: string;
  location?: StationLocation;
  address?: StationAddress;
  timezone?: string;
  priority?: StationPriority;
  categories?: string[];
  metadata?: StationMetadata;
}

/**
 * DTO for station query parameters
 */
export class StationQueryDto {
  city?: string;
  district?: string;
  status?: StationStatus;
  priority?: StationPriority;
  category?: string;
  limit?: number;
  offset?: number;
}

/**
 * DTO for station response
 */
export class StationResponseDto {
  id: string;
  name: string;
  code?: string;
  status: StationStatus;
  city?: string;
  district: string;
  location: StationLocation;
  address: StationAddress;
  priority?: StationPriority;
  categories?: string[];
  lastDataUpdate?: string;
}

/**
 * DTO for batch station operations
 */
export class BatchStationOperationDto {
  stationIds: string[];
  operation: 'activate' | 'deactivate' | 'delete';
}
