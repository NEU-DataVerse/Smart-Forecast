/**
 * Ingestion API Service
 */

import { apiGet, apiPost } from '@/lib/api-client';
import type {
  FullIngestionStatusDto,
  IngestionStatusDto,
  IngestionHealthResponse,
  IngestionStatsResponse,
  MonitoringLocation,
} from '@/types/dto';

const BASE_PATH = '/ingestion';

export const ingestionService = {
  /**
   * Manually trigger full data ingestion (Air Quality + Weather)
   * Recommended endpoint for manual triggers
   */
  async triggerAll(): Promise<FullIngestionStatusDto> {
    return apiPost<FullIngestionStatusDto>(
      `${BASE_PATH}/all`,
      undefined,
      undefined,
      true,
      'Data ingestion triggered successfully',
    );
  },

  /**
   * Manually trigger air quality data ingestion
   */
  async triggerAirQuality(): Promise<IngestionStatusDto> {
    return apiPost<IngestionStatusDto>(
      `${BASE_PATH}/air-quality`,
      undefined,
      undefined,
      true,
      'Air quality ingestion triggered successfully',
    );
  },

  /**
   * Manually trigger weather data ingestion
   */
  async triggerWeather(): Promise<IngestionStatusDto> {
    return apiPost<IngestionStatusDto>(
      `${BASE_PATH}/weather`,
      undefined,
      undefined,
      true,
      'Weather ingestion triggered successfully',
    );
  },

  /**
   * Get monitoring locations
   */
  async getLocations(): Promise<{ count: number; locations: MonitoringLocation[] }> {
    return apiGet<{ count: number; locations: MonitoringLocation[] }>(`${BASE_PATH}/locations`);
  },

  /**
   * Health check for ingestion services
   */
  async getHealth(): Promise<IngestionHealthResponse> {
    return apiGet<IngestionHealthResponse>(`${BASE_PATH}/health`);
  },

  /**
   * Get ingestion statistics summary
   */
  async getStats(): Promise<IngestionStatsResponse> {
    return apiGet<IngestionStatsResponse>(`${BASE_PATH}/stats`);
  },
};
