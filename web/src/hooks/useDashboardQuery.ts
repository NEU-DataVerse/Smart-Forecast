'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { dashboardService, DashboardSummaryResponse } from '@/services/api/dashboard.service';

// Query keys for cache management
export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
};

/**
 * Fetch dashboard summary with auto-refresh
 * Aggregates statistics from stations, alerts, incidents, and ingestion health
 */
export function useDashboardSummary(): UseQueryResult<DashboardSummaryResponse> {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: () => dashboardService.getSummary(),
    refetchInterval: 60_000, // Refresh every 1 minute
    staleTime: 30_000, // Consider data stale after 30 seconds
  });
}
