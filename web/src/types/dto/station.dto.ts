/**
 * Station DTOs
 * Copied from backend/src/modules/stations/dto
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
  addressCountry?: string;
  postalCode?: string;
}

export interface StationMetadata {
  installationDate?: string;
  operator?: string;
  contact?: string;
  description?: string;
  [key: string]: string | undefined;
}

export enum StationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

export enum StationPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export interface ObservationStation {
  id: string;
  type: string;
  code: string;
  name: string;
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
  stations: ObservationStation[];
}

/**
 * DTO for creating a new station
 */
export interface CreateStationDto {
  name: string;
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
export interface UpdateStationDto {
  name?: string;
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
 * Simplified: only filter by status with pagination
 */
export interface StationQueryParams {
  status?: StationStatus;
  limit?: number;
  offset?: number;
}

/**
 * DTO for station response
 */
export interface StationResponseDto {
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
 * Station statistics response
 */
export interface StationStatsResponse {
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
}
