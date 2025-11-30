'use client';

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import {
  incidentService,
  IncidentListResponse,
  IncidentStatsByType,
  IncidentStatsByStatus,
  IncidentTrendData,
} from '@/services/api/incident.service';
import type {
  IIncident,
  IIncidentQueryParams,
  IUpdateIncidentStatusRequest,
} from '@smart-forecast/shared';

// Polling interval: 30 seconds
const POLLING_INTERVAL = 30_000;
const STALE_TIME = 30_000;

// Query keys for cache management
export const incidentKeys = {
  all: ['incidents'] as const,
  lists: () => [...incidentKeys.all, 'list'] as const,
  list: (params?: IIncidentQueryParams) => [...incidentKeys.lists(), params] as const,
  myReports: () => [...incidentKeys.all, 'my-reports'] as const,
  myReportsList: (params?: IIncidentQueryParams) => [...incidentKeys.myReports(), params] as const,
  detail: (id: string) => [...incidentKeys.all, 'detail', id] as const,
  stats: () => [...incidentKeys.all, 'stats'] as const,
  statsByType: () => [...incidentKeys.stats(), 'by-type'] as const,
  statsByStatus: () => [...incidentKeys.stats(), 'by-status'] as const,
  trend: () => [...incidentKeys.stats(), 'trend'] as const,
};

// ============ INCIDENT QUERIES ============

/**
 * Fetch paginated incidents with optional filters and polling
 */
export function useIncidents(
  params?: IIncidentQueryParams,
  options?: { enablePolling?: boolean },
): UseQueryResult<IncidentListResponse> {
  const enablePolling = options?.enablePolling ?? true;

  return useQuery({
    queryKey: incidentKeys.list(params),
    queryFn: () => incidentService.getAll(params),
    staleTime: STALE_TIME,
    refetchInterval: enablePolling ? POLLING_INTERVAL : false,
  });
}

/**
 * Fetch current user's incident reports
 */
export function useMyIncidentReports(
  params?: IIncidentQueryParams,
): UseQueryResult<IncidentListResponse> {
  return useQuery({
    queryKey: incidentKeys.myReportsList(params),
    queryFn: () => incidentService.getMyReports(params),
    staleTime: STALE_TIME,
  });
}

/**
 * Fetch a single incident by ID
 */
export function useIncident(id: string): UseQueryResult<IIncident> {
  return useQuery({
    queryKey: incidentKeys.detail(id),
    queryFn: () => incidentService.getById(id),
    enabled: !!id,
  });
}

// ============ STATISTICS QUERIES ============

/**
 * Fetch incident statistics by type with polling
 */
export function useIncidentStatsByType(options?: {
  enablePolling?: boolean;
}): UseQueryResult<IncidentStatsByType[]> {
  const enablePolling = options?.enablePolling ?? true;

  return useQuery({
    queryKey: incidentKeys.statsByType(),
    queryFn: () => incidentService.getStatsByType(),
    staleTime: STALE_TIME,
    refetchInterval: enablePolling ? POLLING_INTERVAL : false,
  });
}

/**
 * Fetch incident statistics by status with polling
 */
export function useIncidentStatsByStatus(options?: {
  enablePolling?: boolean;
}): UseQueryResult<IncidentStatsByStatus[]> {
  const enablePolling = options?.enablePolling ?? true;

  return useQuery({
    queryKey: incidentKeys.statsByStatus(),
    queryFn: () => incidentService.getStatsByStatus(),
    staleTime: STALE_TIME,
    refetchInterval: enablePolling ? POLLING_INTERVAL : false,
  });
}

/**
 * Fetch incident trend data (last 30 days)
 */
export function useIncidentTrend(options?: {
  enablePolling?: boolean;
}): UseQueryResult<IncidentTrendData[]> {
  const enablePolling = options?.enablePolling ?? false; // Trend doesn't need frequent polling

  return useQuery({
    queryKey: incidentKeys.trend(),
    queryFn: () => incidentService.getTrend(),
    staleTime: 60_000, // 1 minute for trend data
    refetchInterval: enablePolling ? 60_000 : false,
  });
}

/**
 * Combined hook for all statistics
 */
export function useIncidentStats(options?: { enablePolling?: boolean }) {
  return {
    byType: useIncidentStatsByType(options),
    byStatus: useIncidentStatsByStatus(options),
    trend: useIncidentTrend(options),
  };
}

// ============ INCIDENT MUTATIONS ============

/**
 * Update incident status (Admin only)
 */
export function useUpdateIncidentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateIncidentStatusRequest }) =>
      incidentService.updateStatus(id, data),
    onSuccess: (updatedIncident, { id }) => {
      // Update the specific incident in cache
      queryClient.setQueryData(incidentKeys.detail(id), updatedIncident);
      // Invalidate list and stats queries to refetch
      queryClient.invalidateQueries({ queryKey: incidentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: incidentKeys.stats() });
    },
  });
}

/**
 * Delete an incident (Admin only)
 */
export function useDeleteIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => incidentService.delete(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: incidentKeys.detail(id) });
      // Invalidate list and stats queries
      queryClient.invalidateQueries({ queryKey: incidentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: incidentKeys.stats() });
    },
  });
}

// ============ HELPER HOOKS ============

/**
 * Combined hook for all incident mutations
 */
export function useIncidentMutations() {
  return {
    updateStatus: useUpdateIncidentStatus(),
    delete: useDeleteIncident(),
  };
}
