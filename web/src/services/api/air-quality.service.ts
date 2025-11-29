/**
 * Air Quality API Service
 * Synced with backend/src/modules/air-quality/air-quality.controller.ts
 */

import { apiGet } from '@/lib/api-client';
import type {
  AirQualityHistoryParams,
  CurrentAirQualityResponse,
  ForecastAirQualityResponse,
  AirQualityListResponse,
  CompareAirQualityResponse,
  AirQualityAveragesResponse,
  DateRangeQuery,
} from '@/types/dto';

const BASE_PATH = '/air-quality';

export const airQualityService = {
  /**
   * Get current air quality data from Orion-LD
   * GET /api/v1/air-quality/current
   */
  async getCurrent(stationId?: string): Promise<CurrentAirQualityResponse> {
    return apiGet<CurrentAirQualityResponse>(
      `${BASE_PATH}/current`,
      stationId ? { stationId } : undefined,
    );
  },

  /**
   * Get air quality forecast data (4-day hourly forecast)
   * GET /api/v1/air-quality/forecast
   */
  async getForecast(stationId?: string): Promise<ForecastAirQualityResponse> {
    return apiGet<ForecastAirQualityResponse>(
      `${BASE_PATH}/forecast`,
      stationId ? { stationId } : undefined,
    );
  },

  /**
   * Get historical air quality data from PostgreSQL
   * GET /api/v1/air-quality/history
   */
  async getHistory(params?: AirQualityHistoryParams): Promise<AirQualityListResponse> {
    return apiGet<AirQualityListResponse>(`${BASE_PATH}/history`, params);
  },

  /**
   * Compare air quality across multiple stations (admin only)
   * GET /api/v1/air-quality/compare
   */
  async compareStations(stationCodes: string[]): Promise<CompareAirQualityResponse> {
    return apiGet<CompareAirQualityResponse>(`${BASE_PATH}/compare`, {
      stationCodes: stationCodes.join(','),
    });
  },

  /**
   * Get air quality averages (admin only)
   * GET /api/v1/air-quality/stats/averages
   */
  async getAverages(params: DateRangeQuery): Promise<AirQualityAveragesResponse> {
    return apiGet<AirQualityAveragesResponse>(`${BASE_PATH}/stats/averages`, params);
  },
};
