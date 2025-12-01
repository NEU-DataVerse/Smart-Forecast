/**
 * Dashboard API Service
 * Handles dashboard summary and statistics API calls
 */

import { apiGet } from '@/lib/api-client';

const BASE_PATH = '/dashboard';

/**
 * Station statistics (for dashboard summary)
 */
export interface DashboardStationStats {
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
}

/**
 * Alert statistics by level (for dashboard summary)
 */
export interface DashboardAlertStatsByLevel {
  LOW: number;
  MEDIUM: number;
  HIGH: number;
  CRITICAL: number;
}

/**
 * Alert statistics (for dashboard summary)
 */
export interface DashboardAlertStats {
  total: number;
  activeCount: number;
  byLevel: DashboardAlertStatsByLevel;
}

/**
 * Incident statistics (for dashboard summary)
 */
export interface DashboardIncidentStats {
  total: number;
  pending: number;
  verified: number;
  inProgress: number;
  resolved: number;
}

/**
 * Ingestion health status (for dashboard summary)
 */
export interface DashboardIngestionHealth {
  owm: boolean;
  orion: boolean;
}

/**
 * Dashboard summary response
 */
export interface DashboardSummaryResponse {
  stations: DashboardStationStats;
  alerts: DashboardAlertStats;
  incidents: DashboardIncidentStats;
  ingestion: DashboardIngestionHealth;
  timestamp: string;
}

export const dashboardService = {
  /**
   * Get dashboard summary with all statistics
   */
  async getSummary(): Promise<DashboardSummaryResponse> {
    return apiGet<DashboardSummaryResponse>(`${BASE_PATH}/summary`);
  },
};
