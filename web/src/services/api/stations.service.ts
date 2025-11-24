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
    return apiGet<ObservationStation[]>(BASE_PATH, params);
  },

  /**
   * Get active stations only
   */
  async getActive(): Promise<ObservationStation[]> {
    return apiGet<ObservationStation[]>(`${BASE_PATH}/active`);
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
    return apiGet<ObservationStation[]>(`${BASE_PATH}/city/${city}`);
  },

  /**
   * Get stations by district
   */
  async getByDistrict(city: string, district: string): Promise<ObservationStation[]> {
    return apiGet<ObservationStation[]>(`${BASE_PATH}/city/${city}/district/${district}`);
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
    return apiPost<ObservationStation>(
      BASE_PATH,
      data,
      undefined,
      true,
      'Station created successfully',
    );
  },

  /**
   * Update a station
   */
  async update(id: string, data: UpdateStationDto): Promise<ObservationStation> {
    return apiPut<ObservationStation>(
      `${BASE_PATH}/${id}`,
      data,
      undefined,
      true,
      'Station updated successfully',
    );
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
    return apiPost<ObservationStation>(
      `${BASE_PATH}/${id}/activate`,
      undefined,
      undefined,
      true,
      'Station activated successfully',
    );
  },

  /**
   * Deactivate a station
   */
  async deactivate(id: string): Promise<ObservationStation> {
    return apiPost<ObservationStation>(
      `${BASE_PATH}/${id}/deactivate`,
      undefined,
      undefined,
      true,
      'Station deactivated successfully',
    );
  },

  /**
   * Batch operations on stations
   */
  async batchOperation(
    data: BatchStationOperationDto,
  ): Promise<{ message: string; results: any[] }> {
    return apiPost<{ message: string; results: any[] }>(
      `${BASE_PATH}/batch`,
      data,
      undefined,
      true,
      'Batch operation completed successfully',
    );
  },
};
