import { GeoPoint } from './geojson.types';

/**
 * Weather Observed entity (NGSI-LD compatible)
 * Based on FIWARE Smart Data Models
 */
export interface IWeatherObserved {
  id: string;
  type: 'WeatherObserved';
  dateObserved: Date;
  location: GeoPoint;
  address?: {
    addressCountry?: string;
    addressLocality?: string; // City
  };
  // Temperature (in Celsius)
  temperature?: number;
  feelsLikeTemperature?: number;
  // Humidity (percentage)
  relativeHumidity?: number;
  // Atmospheric pressure (in hPa)
  atmosphericPressure?: number;
  // Wind
  windSpeed?: number; // in m/s
  windDirection?: number; // in degrees
  // Precipitation
  precipitation?: number; // in mm
  // Weather condition
  weatherType?: string; // e.g., 'Clear', 'Clouds', 'Rain', 'Snow'
  weatherDescription?: string; // e.g., 'light rain'
  // Visibility (in meters)
  visibility?: number;
  // UV Index
  uvIndex?: number;
  // Data source
  source?: string; // e.g., 'OpenWeatherMap'
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Weather forecast data (OWM compatible format)
 */
export interface IWeatherForecast {
  dt: number; // Unix timestamp (UTC)
  temp: {
    day: number; // Temperature at day time (Celsius)
    min: number; // Min daily temperature
    max: number; // Max daily temperature
    night: number; // Temperature at night
    eve: number; // Temperature at evening
    morn: number; // Temperature at morning
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number; // Atmospheric pressure (hPa)
  humidity: number; // Humidity (%)
  weather: Array<{
    id: number; // Weather condition ID
    main: string; // Group (Rain, Snow, Clouds, etc.)
    description: string; // Weather condition description
    icon: string; // Weather icon ID
  }>;
  speed: number; // Wind speed (m/s)
  deg: number; // Wind direction (degrees)
  gust?: number; // Wind gust (m/s)
  clouds: number; // Cloudiness (%)
  pop: number; // Probability of precipitation (0-1)
  rain?: number; // Rain volume (mm)
  snow?: number; // Snow volume (mm)
}

/**
 * Weather Forecast response (OWM compatible format)
 */
export interface IWeatherForecastResponse {
  city: {
    coord: {
      lat: number;
      lon: number;
    };
    name: string; // City name
    country: string; // Country code
    timezone: number; // UTC offset in seconds
  };
  list: IWeatherForecast[];
}

/**
 * Weather query parameters
 */
export interface IWeatherQueryParams {
  city?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

/**
 * Weather history data point
 */
export interface IWeatherDataPoint {
  timestamp: Date;
  temperature: number;
  humidity?: number;
  precipitation?: number;
  weatherType?: string;
}

/**
 * Weather statistics
 */
export interface IWeatherStats {
  avgTemperature: number;
  maxTemperature: number;
  minTemperature: number;
  avgHumidity?: number;
  totalPrecipitation?: number;
  period: {
    start: Date;
    end: Date;
  };
}
