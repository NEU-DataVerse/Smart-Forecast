/**
 * Stations API Service
 * Synced with backend/src/modules/stations/station.controller.ts
 */

import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-client';
import type {
  ObservationStation,
  StationQueryParams,
  CreateStationDto,
  UpdateStationDto,
  StationStatsResponse,
  StationStatus,
} from '@/types/dto';

const BASE_PATH = '/stations';

/**
 * Response types matching backend controller
 */
interface StationListResponse {
  count: number;
  stations: ObservationStation[];
}

interface NearestStationResponse {
  coordinates: { lat: number; lon: number };
  radius: number;
  count: number;
  stations: Array<ObservationStation & { distance: number }>;
}

interface StationMutationResponse {
  message: string;
  station: ObservationStation;
}

export const stationsService = {
  /**
   * List all stations with optional filters
   * GET /stations?status=active&limit=10&offset=0
   */
  async list(params?: StationQueryParams): Promise<ObservationStation[]> {
    const response = await apiGet<StationListResponse>(BASE_PATH, params);
    return response.stations;
  },

  /**
   * Get active stations only (convenience method)
   * Uses list() with status filter
   */
  async getActive(): Promise<ObservationStation[]> {
    return this.list({ status: 'active' as StationStatus });
  },

  /**
   * Get station statistics
   * GET /stations/stats
   */
  async getStats(): Promise<StationStatsResponse> {
    return apiGet<StationStatsResponse>(`${BASE_PATH}/stats`);
  },

  /**
   * Find nearest station(s) by GPS coordinates
   * GET /stations/nearest?lat=21.028&lon=105.804&radius=50&limit=1
   */
  async findNearest(
    lat: number,
    lon: number,
    radius?: number,
    limit?: number,
  ): Promise<NearestStationResponse> {
    const params = { lat, lon, ...(radius && { radius }), ...(limit && { limit }) };
    return apiGet<NearestStationResponse>(`${BASE_PATH}/nearest`, params);
  },

  /**
   * Get station by ID
   * GET /stations/:id
   */
  async getById(id: string): Promise<ObservationStation> {
    return apiGet<ObservationStation>(`${BASE_PATH}/${encodeURIComponent(id)}`);
  },

  /**
   * Create a new station
   * POST /stations
   */
  async create(data: CreateStationDto): Promise<ObservationStation> {
    const response = await apiPost<StationMutationResponse>(
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
   * PUT /stations/:id
   */
  async update(id: string, data: UpdateStationDto): Promise<ObservationStation> {
    const response = await apiPut<StationMutationResponse>(
      `${BASE_PATH}/${encodeURIComponent(id)}`,
      data,
      undefined,
      true,
      'Station updated successfully',
    );
    return response.station;
  },

  /**
   * Delete a station (soft delete)
   * DELETE /stations/:id
   */
  async delete(id: string): Promise<void> {
    await apiDelete<void>(
      `${BASE_PATH}/${encodeURIComponent(id)}`,
      undefined,
      true,
      'Station deleted successfully',
    );
  },

  /**
   * Activate a station
   * POST /stations/:id/activate
   */
  async activate(id: string): Promise<ObservationStation> {
    const response = await apiPost<StationMutationResponse>(
      `${BASE_PATH}/${encodeURIComponent(id)}/activate`,
      undefined,
      undefined,
      true,
      'Station activated successfully',
    );
    return response.station;
  },

  /**
   * Deactivate a station
   * POST /stations/:id/deactivate
   */
  async deactivate(id: string): Promise<ObservationStation> {
    const response = await apiPost<StationMutationResponse>(
      `${BASE_PATH}/${encodeURIComponent(id)}/deactivate`,
      undefined,
      undefined,
      true,
      'Station deactivated successfully',
    );
    return response.station;
  },

  /**
   * Set station to maintenance mode
   * POST /stations/:id/maintenance
   */
  async setMaintenance(id: string): Promise<ObservationStation> {
    const response = await apiPost<StationMutationResponse>(
      `${BASE_PATH}/${encodeURIComponent(id)}/maintenance`,
      undefined,
      undefined,
      true,
      'Station set to maintenance mode',
    );
    return response.station;
  },
};
