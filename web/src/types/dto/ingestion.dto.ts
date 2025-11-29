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
