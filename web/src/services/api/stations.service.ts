/**
 * Stations API Service
 */

import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-client';
import type {
  ObservationStation,
  StationQueryParams,
  CreateStationDto,
  UpdateStationDto,
  BatchStationOperationDto,
  StationStatsResponse,
  StationDataSource,
} from '@/types/dto';

const BASE_PATH = '/stations';

export const stationsService = {
  /**
   * List all stations with optional filters
   */
  async list(params?: StationQueryParams): Promise<ObservationStation[]> {
    const response = await apiGet<{ count: number; stations: ObservationStation[] }>(
      BASE_PATH,
      params,
    );
    return response.stations;
  },

  /**
   * Get active stations only
   */
  async getActive(): Promise<ObservationStation[]> {
    const response = await apiGet<{ count: number; stations: ObservationStation[] }>(
      `${BASE_PATH}/active`,
    );
    return response.stations;
  },

  /**
   * Get station statistics
   */
  async getStats(): Promise<StationStatsResponse> {
    return apiGet<StationStatsResponse>(`${BASE_PATH}/stats`);
  },

  /**
   * Get data source information
   */
  async getInfo(): Promise<StationDataSource> {
    return apiGet<StationDataSource>(`${BASE_PATH}/info`);
  },

  /**
   * Get stations by city
   */
  async getByCity(city: string): Promise<ObservationStation[]> {
    const response = await apiGet<{ city: string; count: number; stations: ObservationStation[] }>(
      `${BASE_PATH}/city/${city}`,
    );
    return response.stations;
  },

  /**
   * Get stations by district
   */
  async getByDistrict(district: string): Promise<ObservationStation[]> {
    const response = await apiGet<{
      district: string;
      count: number;
      stations: ObservationStation[];
    }>(`${BASE_PATH}/district/${district}`);
    return response.stations;
  },

  /**
   * Get station by ID
   */
  async getById(id: string): Promise<ObservationStation> {
    return apiGet<ObservationStation>(`${BASE_PATH}/${id}`);
  },

  /**
   * Create a new station
   */
  async create(data: CreateStationDto): Promise<ObservationStation> {
    const response = await apiPost<{ message: string; station: ObservationStation }>(
      BASE_PATH,
      data,
      undefined,
      true,
      'Station created successfully',
    );
    return response.station;
  },

  /**
   * Update a station
   */
  async update(id: string, data: UpdateStationDto): Promise<ObservationStation> {
    const response = await apiPut<{ message: string; station: ObservationStation }>(
      `${BASE_PATH}/${id}`,
      data,
      undefined,
      true,
      'Station updated successfully',
    );
    return response.station;
  },

  /**
   * Delete a station (soft delete)
   */
  async delete(id: string): Promise<{ message: string }> {
    return apiDelete<{ message: string }>(
      `${BASE_PATH}/${id}`,
      undefined,
      true,
      'Station deleted successfully',
    );
  },

  /**
   * Activate a station
   */
  async activate(id: string): Promise<ObservationStation> {
    const response = await apiPost<{ message: string; station: ObservationStation }>(
      `${BASE_PATH}/${id}/activate`,
      undefined,
      undefined,
      true,
      'Station activated successfully',
    );
    return response.station;
  },

  /**
   * Deactivate a station
   */
  async deactivate(id: string): Promise<ObservationStation> {
    const response = await apiPost<{ message: string; station: ObservationStation }>(
      `${BASE_PATH}/${id}/deactivate`,
      undefined,
      undefined,
      true,
      'Station deactivated successfully',
    );
    return response.station;
  },

  /**
   * Batch operations on stations
   */
  async batchOperation(
    data: BatchStationOperationDto,
  ): Promise<{ success: number; failed: number }> {
    const response = await apiPost<{ message: string; success: number; failed: number }>(
      `${BASE_PATH}/batch`,
      data,
      undefined,
      true,
      'Batch operation completed successfully',
    );
    return { success: response.success, failed: response.failed };
  },
};
