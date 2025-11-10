import { GeoPoint } from "./geojson.types";

/**
 * Weather Observed entity (NGSI-LD compatible)
 * Based on FIWARE Smart Data Models
 */
export interface IWeatherObserved {
    id: string;
    type: "WeatherObserved";
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
 * Weather forecast data
 */
export interface IWeatherForecast {
    id: string;
    location: GeoPoint;
    forecastTime: Date;
    temperature?: number;
    weatherType?: string;
    weatherDescription?: string;
    precipitation?: number;
    humidity?: number;
    windSpeed?: number;
    source?: string;
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
