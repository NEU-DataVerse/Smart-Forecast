'use client';

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { alertService, AlertListResponse } from '@/services/api/alert.service';
import type {
  IAlert,
  IAlertQueryParams,
  ICreateAlertRequest,
  IAlertThreshold,
  ICreateAlertThresholdRequest,
  IUpdateAlertThresholdRequest,
} from '@smart-forecast/shared';

// Query keys for cache management
export const alertKeys = {
  all: ['alerts'] as const,
  lists: () => [...alertKeys.all, 'list'] as const,
  list: (params?: IAlertQueryParams) => [...alertKeys.lists(), params] as const,
  active: () => [...alertKeys.all, 'active'] as const,
  thresholds: () => [...alertKeys.all, 'thresholds'] as const,
  activeThresholds: () => [...alertKeys.thresholds(), 'active'] as const,
  threshold: (id: string) => [...alertKeys.thresholds(), id] as const,
};

// ============ ALERT QUERIES ============

/**
 * Fetch paginated alert history with optional filters
 */
export function useAlerts(params?: IAlertQueryParams): UseQueryResult<AlertListResponse> {
  return useQuery({
    queryKey: alertKeys.list(params),
    queryFn: () => alertService.getAll(params),
    staleTime: 30_000, // 30 seconds
  });
}

/**
 * Fetch currently active alerts with auto-refresh (polling)
 */
export function useActiveAlerts(): UseQueryResult<IAlert[]> {
  return useQuery({
    queryKey: alertKeys.active(),
    queryFn: () => alertService.getActive(),
    refetchInterval: 60_000, // Poll every 1 minute
    staleTime: 30_000,
  });
}

// ============ ALERT MUTATIONS ============

/**
 * Create a new alert (also used for resending with modified data)
 */
export function useCreateAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateAlertRequest) => alertService.create(data),
    onSuccess: () => {
      // Invalidate all alert queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: alertKeys.all });
    },
  });
}

/**
 * Manually trigger threshold check
 */
export function useTriggerCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => alertService.triggerCheck(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alertKeys.all });
    },
  });
}

/**
 * Cleanup FCM tokens
 */
export function useCleanupTokens() {
  return useMutation({
    mutationFn: () => alertService.cleanupTokens(),
  });
}

// ============ THRESHOLD QUERIES ============

/**
 * Fetch all alert thresholds
 */
export function useAlertThresholds(): UseQueryResult<IAlertThreshold[]> {
  return useQuery({
    queryKey: alertKeys.thresholds(),
    queryFn: () => alertService.getThresholds(),
    staleTime: 60_000, // 1 minute
  });
}

/**
 * Fetch active thresholds only
 */
export function useActiveThresholds(): UseQueryResult<IAlertThreshold[]> {
  return useQuery({
    queryKey: alertKeys.activeThresholds(),
    queryFn: () => alertService.getActiveThresholds(),
    staleTime: 60_000,
  });
}

/**
 * Fetch a specific threshold by ID
 */
export function useAlertThreshold(id: string): UseQueryResult<IAlertThreshold> {
  return useQuery({
    queryKey: alertKeys.threshold(id),
    queryFn: () => alertService.getThresholdById(id),
    enabled: !!id,
  });
}

// ============ THRESHOLD MUTATIONS ============

/**
 * Create a new threshold
 */
export function useCreateThreshold() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateAlertThresholdRequest) => alertService.createThreshold(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alertKeys.thresholds() });
    },
  });
}

/**
 * Update an existing threshold
 */
export function useUpdateThreshold() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateAlertThresholdRequest }) =>
      alertService.updateThreshold(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: alertKeys.threshold(id) });
      queryClient.invalidateQueries({ queryKey: alertKeys.thresholds() });
    },
  });
}

/**
 * Delete a threshold
 */
export function useDeleteThreshold() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alertService.deleteThreshold(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alertKeys.thresholds() });
    },
  });
}

/**
 * Toggle threshold active status
 */
export function useToggleThreshold() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alertService.toggleThreshold(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: alertKeys.threshold(id) });
      queryClient.invalidateQueries({ queryKey: alertKeys.thresholds() });
    },
  });
}

// ============ HELPER HOOKS ============

/**
 * Combined hook for all threshold mutations
 */
export function useThresholdMutations() {
  return {
    create: useCreateThreshold(),
    update: useUpdateThreshold(),
    delete: useDeleteThreshold(),
    toggle: useToggleThreshold(),
  };
}
