/**
 * Incident API Service
 * Handles all incident report related API calls
 */

import { apiGet, apiPut, apiDelete } from '@/lib/api-client';
import type {
  IIncident,
  IIncidentQueryParams,
  IUpdateIncidentStatusRequest,
} from '@smart-forecast/shared';

const BASE_PATH = '/incident';

/**
 * Paginated incident response
 */
export interface IncidentListResponse {
  data: IIncident[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Statistics by type response
 */
export interface IncidentStatsByType {
  type: string;
  count: number;
}

/**
 * Statistics by status response
 */
export interface IncidentStatsByStatus {
  status: string;
  count: number;
}

/**
 * Trend data response (daily count for last 30 days)
 */
export interface IncidentTrendData {
  date: string;
  count: number;
}

export const incidentService = {
  // ============ INCIDENT CRUD ============

  /**
   * Get paginated incidents with optional filters
   */
  async getAll(params?: IIncidentQueryParams): Promise<IncidentListResponse> {
    return apiGet<IncidentListResponse>(BASE_PATH, params);
  },

  /**
   * Get a single incident by ID
   */
  async getById(id: string): Promise<IIncident> {
    return apiGet<IIncident>(`${BASE_PATH}/${id}`);
  },

  /**
   * Get current user's incident reports
   */
  async getMyReports(params?: IIncidentQueryParams): Promise<IncidentListResponse> {
    return apiGet<IncidentListResponse>(`${BASE_PATH}/my-reports`, params);
  },

  /**
   * Update incident status (Admin only)
   */
  async updateStatus(id: string, data: IUpdateIncidentStatusRequest): Promise<IIncident> {
    return apiPut<IIncident>(
      `${BASE_PATH}/${id}/status`,
      data,
      undefined,
      true,
      'Trạng thái báo cáo đã được cập nhật',
    );
  },

  /**
   * Delete an incident (Admin only)
   */
  async delete(id: string): Promise<void> {
    return apiDelete<void>(`${BASE_PATH}/${id}`, undefined, true, 'Báo cáo đã được xóa');
  },

  // ============ STATISTICS (Admin only) ============

  /**
   * Get incident statistics grouped by type
   */
  async getStatsByType(): Promise<IncidentStatsByType[]> {
    return apiGet<IncidentStatsByType[]>(`${BASE_PATH}/stats/by-type`);
  },

  /**
   * Get incident statistics grouped by status
   */
  async getStatsByStatus(): Promise<IncidentStatsByStatus[]> {
    return apiGet<IncidentStatsByStatus[]>(`${BASE_PATH}/stats/by-status`);
  },

  /**
   * Get daily incident count for the last 30 days
   */
  async getTrend(): Promise<IncidentTrendData[]> {
    return apiGet<IncidentTrendData[]>(`${BASE_PATH}/stats/trend`);
  },
};
