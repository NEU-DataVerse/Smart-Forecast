import { GeoPoint } from './geojson.types';

/**
 * Air Quality Observed entity (NGSI-LD compatible)
 * Based on FIWARE Smart Data Models
 */
export interface IAirQualityObserved {
  id: string;
  type: 'AirQualityObserved';
  dateObserved: Date;
  location: GeoPoint;
  address?: {
    addressCountry?: string;
    addressLocality?: string; // City
    streetAddress?: string;
  };
  // Pollutant measurements (in µg/m³)
  pm25?: number; // PM2.5
  pm10?: number; // PM10
  no2?: number; // Nitrogen Dioxide
  so2?: number; // Sulfur Dioxide
  co?: number; // Carbon Monoxide (in mg/m³)
  o3?: number; // Ozone
  // Air Quality Index
  aqi?: number;
  aqiCategory?:
    | 'Good'
    | 'Moderate'
    | 'Unhealthy for Sensitive Groups'
    | 'Unhealthy'
    | 'Very Unhealthy'
    | 'Hazardous';
  // Data source
  source?: string; // e.g., 'OpenAQ'
  reliability?: number; // 0-1 scale
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Air Quality query parameters
 */
export interface IAirQualityQueryParams {
  city?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

/**
 * Air Quality history data point
 */
export interface IAirQualityDataPoint {
  timestamp: Date;
  aqi: number;
  pm25?: number;
  pm10?: number;
  category?: string;
}

/**
 * Air Quality statistics
 */
export interface IAirQualityStats {
  avgAqi: number;
  maxAqi: number;
  minAqi: number;
  avgPm25?: number;
  avgPm10?: number;
  period: {
    start: Date;
    end: Date;
  };
}

/**
 * Air Quality Forecast data point (OWM compatible format)
 */
export interface IAirQualityForecast {
  dt: number; // Unix timestamp (UTC)
  main: {
    aqi: number; // Air Quality Index (1-5)
  };
  components: {
    co?: number; // Carbon monoxide (μg/m³)
    no?: number; // Nitrogen monoxide (μg/m³)
    no2?: number; // Nitrogen dioxide (μg/m³)
    o3?: number; // Ozone (μg/m³)
    so2?: number; // Sulfur dioxide (μg/m³)
    pm2_5?: number; // PM2.5 (μg/m³)
    pm10?: number; // PM10 (μg/m³)
    nh3?: number; // Ammonia (μg/m³)
  };
}

/**
 * Air Quality Forecast response (OWM compatible format)
 */
export interface IAirQualityForecastResponse {
  coord: {
    lat: number;
    lon: number;
  };
  list: IAirQualityForecast[];
}
