/**
 * Air Quality DTOs
 * Synced with backend/src/modules/air-quality/dto
 */

/**
 * Query parameters for air quality historical data
 * Matches backend AirQualityQueryDto
 */
export interface AirQualityHistoryParams {
  stationId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * Query parameters for comparing stations (admin only)
 * Matches backend CompareQueryDto
 */
export interface CompareStationsParams {
  stationCodes: string[];
}

/**
 * Date range query parameters
 * Matches backend DateRangeQueryDto
 */
export interface DateRangeQuery {
  startDate: string;
  endDate: string;
}

/**
 * Air quality data response interface
 * Matches backend AirQualityDataResponse
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
 * Matches backend AirQualityListResponse
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
 * Matches backend CurrentAirQualityResponse
 */
export interface CurrentAirQualityResponse {
  data: AirQualityDataResponse[];
  source: 'orion-ld';
  timestamp: string;
}

/**
 * Forecast air quality item (with time range)
 */
export interface ForecastAirQualityItem extends AirQualityDataResponse {
  validFrom?: string;
  validTo?: string;
}

/**
 * Forecast air quality response (from Orion-LD)
 * Matches backend ForecastAirQualityResponse
 */
export interface ForecastAirQualityResponse {
  data: ForecastAirQualityItem[];
  source: 'orion-ld';
  timestamp: string;
}

/**
 * Compare station item
 */
export interface CompareStationItem {
  stationId: string;
  stationName?: string;
  data: AirQualityDataResponse | null;
}

/**
 * Compare air quality response (for admin dashboard)
 * Matches backend CompareAirQualityResponse
 */
export interface CompareAirQualityResponse {
  stations: CompareStationItem[];
  source: 'orion-ld';
  timestamp: string;
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
