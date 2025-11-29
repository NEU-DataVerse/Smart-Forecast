/**
 * Weather API Service
 */

import { apiGet } from '@/lib/api-client';
import type {
  WeatherQueryParams,
  WeatherHistoryParams,
  CompareWeatherParams,
  CurrentWeatherResponse,
  ForecastWeatherResponse,
  WeatherListResponse,
  CompareWeatherResponse,
  WeatherTrendsResponse,
  DateRangeQuery,
} from '@/types/dto';

const BASE_PATH = '/weather';

export const weatherService = {
  /**
   * Get current weather data from Orion-LD
   * @param stationId - Optional station ID to filter by
   */
  async getCurrent(stationId?: string): Promise<CurrentWeatherResponse> {
    const params = stationId ? { stationId } : undefined;
    return apiGet<CurrentWeatherResponse>(`${BASE_PATH}/current`, params);
  },

  /**
   * Get weather forecast data (7-day daily forecast)
   * @param stationId - Optional station ID to filter by
   */
  async getForecast(stationId?: string): Promise<ForecastWeatherResponse> {
    const params = stationId ? { stationId } : undefined;
    return apiGet<ForecastWeatherResponse>(`${BASE_PATH}/forecast`, params);
  },

  /**
   * Get historical weather data from PostgreSQL
   */
  async getHistory(params: WeatherHistoryParams): Promise<WeatherListResponse> {
    return apiGet<WeatherListResponse>(`${BASE_PATH}/history`, params);
  },

  /**
   * Compare weather across multiple stations (admin only)
   */
  async compareStations(params: CompareWeatherParams): Promise<CompareWeatherResponse> {
    return apiGet<CompareWeatherResponse>(`${BASE_PATH}/compare`, {
      stationCodes: params.stationCodes.join(','),
    });
  },

  /**
   * Get weather trends (admin only)
   */
  async getTrends(params: DateRangeQuery): Promise<WeatherTrendsResponse> {
    return apiGet<WeatherTrendsResponse>(`${BASE_PATH}/stats/trends`, params);
  },
};
