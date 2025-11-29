/**
 * Weather DTOs
 * Copied from backend/src/modules/weather/dto
 */

/**
 * Query parameters for weather data
 */
export interface WeatherQueryParams {
  stationId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * Query parameters for history data
 */
export interface WeatherHistoryParams {
  stationId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * Compare stations query params
 */
export interface CompareWeatherParams {
  stationCodes: string[];
}

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
 * Date range query parameters for weather
 */
export interface WeatherDateRangeQuery {
  startDate?: string;
  endDate?: string;
}

/**
 * Weather trends response (admin only)
 */
export interface WeatherTrendsResponse {
  avgTemperature: number;
  avgRainfall: number;
  avgHumidity: number;
  dataPoints: number;
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
  forecast?: ForecastWeatherItem[];
  source: 'orion-ld';
  timestamp: string;
  validUntil: string;
}

/**
 * Forecast item with valid time range
 */
export type ForecastWeatherItem = WeatherDataResponse & {
  validFrom: string;
  validTo: string;
};

/**
 * Compare weather station item
 */
export interface CompareWeatherStationItem {
  stationId: string;
  stationName?: string;
  data: WeatherDataResponse | null;
}

/**
 * Compare weather response (multi-station for admin)
 */
export interface CompareWeatherResponse {
  stations: CompareWeatherStationItem[];
  source: 'orion-ld';
  timestamp: string;
}
