/**
 * Weather API Service
 */

import { apiGet } from '@/lib/api-client';
import type {
  WeatherQueryParams,
  CurrentWeatherResponse,
  ForecastWeatherResponse,
  WeatherListResponse,
} from '@/types/dto';

const BASE_PATH = '/weather';

export const weatherService = {
  /**
   * Get current weather data from Orion-LD
   */
  async getCurrent(params?: WeatherQueryParams): Promise<CurrentWeatherResponse> {
    return apiGet<CurrentWeatherResponse>(`${BASE_PATH}/current`, params);
  },

  /**
   * Get weather forecast data (7-day daily forecast)
   */
  async getForecast(params?: WeatherQueryParams): Promise<ForecastWeatherResponse> {
    return apiGet<ForecastWeatherResponse>(`${BASE_PATH}/forecast`, params);
  },

  /**
   * Get historical weather data from PostgreSQL
   */
  async getHistory(params: WeatherQueryParams): Promise<WeatherListResponse> {
    return apiGet<WeatherListResponse>(`${BASE_PATH}/history`, params);
  },

  /**
   * Get latest weather data by station
   */
  async getByStation(stationId: string): Promise<CurrentWeatherResponse> {
    return apiGet<CurrentWeatherResponse>(`${BASE_PATH}/station/${stationId}`);
  },

  /**
   * Get weather trends (admin only)
   */
  async getTrends(params: { startDate: string; endDate: string }): Promise<{
    avgTemperature: number;
    avgRainfall: number;
    avgHumidity: number;
    dataPoints: number;
  }> {
    return apiGet(`${BASE_PATH}/stats/trends`, params);
  },
};
