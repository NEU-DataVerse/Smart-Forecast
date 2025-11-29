/**
 * Weather data response interface
 */
export interface WeatherDataResponse {
  id: string;
  stationId: string;
  location: {
    lat: number;
    lon: number;
  };
  address?: string;
  dateObserved: string;
  temperature: {
    current?: number;
    feelsLike?: number;
    min?: number;
    max?: number;
  };
  atmospheric: {
    pressure?: number;
    humidity?: number;
    seaLevelPressure?: number;
    groundLevelPressure?: number;
  };
  wind: {
    speed?: number;
    direction?: number;
    gust?: number;
  };
  precipitation?: number;
  visibility?: number;
  cloudiness?: number;
  weather: {
    type?: string;
    description?: string;
    icon?: string;
  };
  sun?: {
    sunrise?: string;
    sunset?: string;
  };
  timezone?: number;
}

/**
 * Paginated weather response
 */
export interface WeatherListResponse {
  data: WeatherDataResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Current weather response (from Orion-LD)
 */
export interface CurrentWeatherResponse {
  data: WeatherDataResponse[];
  source: 'orion-ld';
  timestamp: string;
}

/**
 * Forecast weather response (from Orion-LD)
 */
export interface ForecastWeatherResponse {
  data: Array<WeatherDataResponse & { validFrom: string; validTo: string }>;
  source: 'orion-ld';
  timestamp: string;
}

/**
 * Nearest station info for nearby response
 */
export interface NearestStationInfo {
  code: string;
  name: string;
  distance: number;
}

/**
 * Nearby weather response (GPS-based for mobile)
 */
export interface NearbyWeatherResponse {
  nearestStation: NearestStationInfo;
  current?: WeatherDataResponse;
  forecast?: Array<
    WeatherDataResponse & { validFrom: string; validTo: string }
  >;
  source: 'orion-ld';
  timestamp: string;
  validUntil: string;
}

/**
 * Compare weather response (multi-station for admin)
 */
export interface CompareWeatherResponse {
  stations: Array<{
    stationId: string;
    stationName?: string;
    data: WeatherDataResponse | null;
  }>;
  source: 'orion-ld';
  timestamp: string;
}
