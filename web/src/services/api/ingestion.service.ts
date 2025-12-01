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
  HistoricalIngestionDto,
  HistoricalIngestionResponseDto,
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
      'Kích hoạt thu thập dữ liệu thành công',
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
      'Kích hoạt thu thập chất lượng không khí thành công',
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
      'Kích hoạt thu thập thời tiết thành công',
    );
  },

  /**
   * Trigger historical data ingestion
   * @param dto Historical ingestion parameters (startDate, endDate, types)
   */
  async triggerHistorical(dto: HistoricalIngestionDto): Promise<HistoricalIngestionResponseDto> {
    return apiPost<HistoricalIngestionResponseDto>(
      `${BASE_PATH}/historical`,
      dto,
      undefined,
      true,
      'Thu thập dữ liệu lịch sử thành công',
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
