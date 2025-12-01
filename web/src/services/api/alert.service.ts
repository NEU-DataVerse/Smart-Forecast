/**
 * Alert API Service
 * Handles all alert-related API calls including alerts and thresholds
 */

import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-client';
import type {
  IAlert,
  IAlertQueryParams,
  ICreateAlertRequest,
  IAlertThreshold,
  ICreateAlertThresholdRequest,
  IUpdateAlertThresholdRequest,
} from '@smart-forecast/shared';

const BASE_PATH = '/alert';

/**
 * Paginated alert response
 */
export interface AlertListResponse {
  data: IAlert[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Alert statistics response
 */
export interface AlertStatsResponse {
  total: number;
  activeCount: number;
  byLevel: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    CRITICAL: number;
  };
}

/**
 * Alert trend item (daily count)
 */
export interface AlertTrendItem {
  date: string;
  count: number;
}

export const alertService = {
  // ============ ALERT ENDPOINTS ============

  /**
   * Get paginated alert history with optional filters
   */
  async getAll(params?: IAlertQueryParams): Promise<AlertListResponse> {
    return apiGet<AlertListResponse>(BASE_PATH, params);
  },

  /**
   * Get currently active (non-expired) alerts
   */
  async getActive(): Promise<IAlert[]> {
    return apiGet<IAlert[]>(`${BASE_PATH}/active`);
  },

  /**
   * Get alert statistics
   */
  async getStats(): Promise<AlertStatsResponse> {
    return apiGet<AlertStatsResponse>(`${BASE_PATH}/stats`);
  },

  /**
   * Get alert trend data (daily count for last 30 days)
   */
  async getTrend(): Promise<AlertTrendItem[]> {
    return apiGet<AlertTrendItem[]>(`${BASE_PATH}/stats/trend`);
  },

  /**
   * Create and send a new alert
   */
  async create(data: ICreateAlertRequest): Promise<IAlert> {
    return apiPost<IAlert>(
      BASE_PATH,
      data,
      undefined,
      true,
      'Cảnh báo đã được tạo và gửi thành công',
    );
  },

  /**
   * Manually trigger threshold check (admin)
   */
  async triggerCheck(): Promise<{ message: string }> {
    return apiPost<{ message: string }>(
      `${BASE_PATH}/trigger-check`,
      undefined,
      undefined,
      true,
      'Đã kích hoạt kiểm tra ngưỡng cảnh báo',
    );
  },

  /**
   * Manually trigger FCM token cleanup (admin)
   */
  async cleanupTokens(): Promise<{ message: string }> {
    return apiPost<{ message: string }>(
      `${BASE_PATH}/cleanup-tokens`,
      undefined,
      undefined,
      true,
      'Đã dọn dẹp FCM tokens',
    );
  },

  // ============ THRESHOLD ENDPOINTS ============

  /**
   * Get all alert thresholds
   */
  async getThresholds(): Promise<IAlertThreshold[]> {
    return apiGet<IAlertThreshold[]>(`${BASE_PATH}/thresholds`);
  },

  /**
   * Get active thresholds only
   */
  async getActiveThresholds(): Promise<IAlertThreshold[]> {
    return apiGet<IAlertThreshold[]>(`${BASE_PATH}/thresholds/active`);
  },

  /**
   * Get a specific threshold by ID
   */
  async getThresholdById(id: string): Promise<IAlertThreshold> {
    return apiGet<IAlertThreshold>(`${BASE_PATH}/thresholds/${id}`);
  },

  /**
   * Create a new alert threshold
   */
  async createThreshold(data: ICreateAlertThresholdRequest): Promise<IAlertThreshold> {
    return apiPost<IAlertThreshold>(
      `${BASE_PATH}/thresholds`,
      data,
      undefined,
      true,
      'Ngưỡng cảnh báo đã được tạo thành công',
    );
  },

  /**
   * Update an existing threshold
   */
  async updateThreshold(id: string, data: IUpdateAlertThresholdRequest): Promise<IAlertThreshold> {
    return apiPut<IAlertThreshold>(
      `${BASE_PATH}/thresholds/${id}`,
      data,
      undefined,
      true,
      'Ngưỡng cảnh báo đã được cập nhật',
    );
  },

  /**
   * Delete a threshold
   */
  async deleteThreshold(id: string): Promise<void> {
    return apiDelete<void>(
      `${BASE_PATH}/thresholds/${id}`,
      undefined,
      true,
      'Ngưỡng cảnh báo đã được xóa',
    );
  },

  /**
   * Toggle threshold active status
   */
  async toggleThreshold(id: string): Promise<IAlertThreshold> {
    return apiPost<IAlertThreshold>(
      `${BASE_PATH}/thresholds/${id}/toggle`,
      undefined,
      undefined,
      true,
      'Trạng thái ngưỡng cảnh báo đã được thay đổi',
    );
  },
};
