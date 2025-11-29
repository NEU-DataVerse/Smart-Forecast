/**
 * Air quality data response interface
 */
export interface AirQualityDataResponse {
  id: string;
  stationId: string;
  location: {
    lat: number;
    lon: number;
  };
  address?: string;
  dateObserved: string;
  pollutants: {
    co?: number;
    no?: number;
    no2?: number;
    o3?: number;
    so2?: number;
    pm25?: number;
    pm10?: number;
    nh3?: number;
  };
  aqi: {
    openWeather: {
      index: number;
      level: string;
    };
    epaUS: {
      index: number;
      level: string;
    };
  };
}

/**
 * Paginated air quality response
 */
export interface AirQualityListResponse {
  data: AirQualityDataResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Current air quality response (from Orion-LD)
 */
export interface CurrentAirQualityResponse {
  data: AirQualityDataResponse[];
  source: 'orion-ld';
  timestamp: string;
}

/**
 * Forecast air quality response (from Orion-LD)
 */
export interface ForecastAirQualityResponse {
  data: Array<
    AirQualityDataResponse & { validFrom?: string; validTo?: string }
  >;
  source: 'orion-ld';
  timestamp: string;
}

/**
 * Nearest station info for GPS-based queries
 */
export interface NearestStationInfo {
  code: string;
  name: string;
  distance: number; // in kilometers
}

/**
 * Nearby air quality response (for mobile GPS)
 */
export interface NearbyAirQualityResponse {
  nearestStation: NearestStationInfo;
  current?: AirQualityDataResponse;
  forecast?: Array<
    AirQualityDataResponse & { validFrom?: string; validTo?: string }
  >;
  source: 'orion-ld';
  timestamp: string;
  validUntil: string; // ISO timestamp for cache invalidation
}

/**
 * Compare air quality response (for admin dashboard)
 */
export interface CompareAirQualityResponse {
  stations: Array<{
    stationId: string;
    stationName?: string;
    data: AirQualityDataResponse | null;
  }>;
  source: 'orion-ld';
  timestamp: string;
}
