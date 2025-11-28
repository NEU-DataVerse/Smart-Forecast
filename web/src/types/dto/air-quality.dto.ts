/**
 * Air Quality DTOs
 * Copied from backend/src/modules/air-quality/dto
 */

/**
 * Query parameters for air quality data
 */
export interface AirQualityQueryParams {
  stationId?: string;
  city?: string;
  district?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

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
  data: Array<AirQualityDataResponse & { validFrom?: string; validTo?: string }>;
  source: 'orion-ld';
  timestamp: string;
}

/**
 * Date range query parameters
 */
export interface DateRangeQuery {
  startDate: string;
  endDate: string;
}

/**
 * Air quality averages response (admin only)
 */
export interface AirQualityAveragesResponse {
  avgAQI: number;
  avgPM25: number;
  avgPM10: number;
  avgCO: number;
  avgNO2: number;
  avgSO2: number;
  avgO3: number;
  dataPoints: number;
}
