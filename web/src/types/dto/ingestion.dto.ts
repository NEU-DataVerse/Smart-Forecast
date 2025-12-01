/**
 * Ingestion DTOs
 * Copied from backend/src/modules/ingestion/dto
 */

/**
 * Ingestion status response
 */
export interface IngestionStatusDto {
  message: string;
  success: number;
  failed: number;
  errors?: Array<{
    location: string;
    error: string;
  }>;
}

/**
 * Full ingestion response
 */
export interface FullIngestionStatusDto {
  message: string;
  airQuality: {
    success: number;
    failed: number;
    forecastSuccess?: number;
    forecastFailed?: number;
    errors: Array<{
      location: string;
      error: string;
    }>;
  };
  weather: {
    success: number;
    failed: number;
    forecastSuccess?: number;
    forecastFailed?: number;
    errors: Array<{
      location: string;
      error: string;
    }>;
  };
}

/**
 * Health check response
 */
export interface IngestionHealthResponse {
  status: 'healthy' | 'degraded';
  services: {
    openWeatherMap: string;
    orionLD: string;
  };
}

/**
 * Monitoring location
 */
export interface MonitoringLocation {
  id: string;
  name: string;
  city: string;
  district: string;
  location: {
    lat: number;
    lon: number;
  };
}

/**
 * Ingestion stats response
 */
export interface IngestionStatsResponse {
  message: string;
  locations: number;
  endpoints: {
    current: {
      airQuality: string;
      weather: string;
    };
    all: string;
  };
  description: string;
}

/**
 * Historical ingestion request DTO
 */
export type HistoricalIngestionType = 'weather' | 'air-quality';

export interface HistoricalIngestionDto {
  startDate: string;
  endDate: string;
  types: HistoricalIngestionType[];
}

/**
 * Historical ingestion response DTO
 */
export interface HistoricalIngestionResponseDto {
  message: string;
  weatherRecords: number;
  airQualityRecords: number;
  startDate: string;
  endDate: string;
  types: HistoricalIngestionType[];
  errors?: Array<{
    station: string;
    type: string;
    error: string;
  }>;
}
