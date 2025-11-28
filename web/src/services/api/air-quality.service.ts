/**
 * Air Quality API Service
 */

import { apiGet } from '@/lib/api-client';
import type {
  AirQualityQueryParams,
  CurrentAirQualityResponse,
  ForecastAirQualityResponse,
  AirQualityListResponse,
} from '@/types/dto';

const BASE_PATH = '/air-quality';

export const airQualityService = {
  /**
   * Get current air quality data from Orion-LD
   */
  async getCurrent(params?: AirQualityQueryParams): Promise<CurrentAirQualityResponse> {
    return apiGet<CurrentAirQualityResponse>(`${BASE_PATH}/current`, params);
  },

  /**
   * Get air quality forecast data (4-day hourly forecast)
   */
  async getForecast(params?: AirQualityQueryParams): Promise<ForecastAirQualityResponse> {
    return apiGet<ForecastAirQualityResponse>(`${BASE_PATH}/forecast`, params);
  },

  /**
   * Get historical air quality data from PostgreSQL
   */
  async getHistory(params: AirQualityQueryParams): Promise<AirQualityListResponse> {
    return apiGet<AirQualityListResponse>(`${BASE_PATH}/history`, params);
  },

  /**
   * Get latest air quality data by station
   */
  async getByStation(stationId: string): Promise<CurrentAirQualityResponse> {
    return apiGet<CurrentAirQualityResponse>(`${BASE_PATH}/station/${stationId}`);
  },

  /**
   * Get air quality averages (admin only)
   */
  async getAverages(params: { startDate: string; endDate: string }): Promise<{
    avgAQI: number;
    avgPM25: number;
    avgPM10: number;
    avgCO: number;
    avgNO2: number;
    avgSO2: number;
    avgO3: number;
    dataPoints: number;
  }> {
    return apiGet(`${BASE_PATH}/stats/averages`, params);
  },
};
