import { useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { alertApi, AlertListResponse } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import type { IAlert, IAlertQueryParams } from '@smart-forecast/shared';
import { useEffect } from 'react';

const ALERTS_CACHE_KEY = 'cached_alerts';
const ACTIVE_ALERTS_CACHE_KEY = 'cached_active_alerts';

// Cache config
const STALE_TIME = 30 * 1000; // 30 seconds
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const POLLING_INTERVAL = 60 * 1000; // 1 minute

/**
 * Hook to fetch active alerts with caching and polling
 */
export function useActiveAlerts() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<IAlert[], Error>({
    queryKey: ['alerts', 'active'],
    queryFn: async () => {
      const data = await alertApi.getActiveAlerts(token ?? undefined);
      // Cache to AsyncStorage for offline access
      await AsyncStorage.setItem(ACTIVE_ALERTS_CACHE_KEY, JSON.stringify(data));
      return data;
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchInterval: POLLING_INTERVAL,
    refetchIntervalInBackground: false,
    // Load from cache on initial load
    placeholderData: () => {
      const cached = queryClient.getQueryData<IAlert[]>(['alerts', 'active']);
      return cached;
    },
  });

  // Load cached data on mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const cached = await AsyncStorage.getItem(ACTIVE_ALERTS_CACHE_KEY);
        if (cached && !query.data) {
          const parsedData = JSON.parse(cached) as IAlert[];
          queryClient.setQueryData(['alerts', 'active'], parsedData);
        }
      } catch (error) {
        console.error('Error loading cached alerts:', error);
      }
    };
    loadCachedData();
  }, [queryClient, query.data]);

  return query;
}

/**
 * Hook to fetch paginated alerts with filters
 */
export function useAlerts(params?: IAlertQueryParams) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<AlertListResponse, Error>({
    queryKey: ['alerts', 'list', params],
    queryFn: async () => {
      const data = await alertApi.getAlerts(params, token ?? undefined);
      // Cache first page to AsyncStorage
      if (!params?.page || params.page === 1) {
        await AsyncStorage.setItem(ALERTS_CACHE_KEY, JSON.stringify(data));
      }
      return data;
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchInterval: POLLING_INTERVAL,
    refetchIntervalInBackground: false,
  });

  // Load cached data on mount (for first page only)
  useEffect(() => {
    const loadCachedData = async () => {
      if (!params?.page || params.page === 1) {
        try {
          const cached = await AsyncStorage.getItem(ALERTS_CACHE_KEY);
          if (cached && !query.data) {
            const parsedData = JSON.parse(cached) as AlertListResponse;
            queryClient.setQueryData(['alerts', 'list', params], parsedData);
          }
        } catch (error) {
          console.error('Error loading cached alerts:', error);
        }
      }
    };
    loadCachedData();
  }, [queryClient, params, query.data]);

  return query;
}

/**
 * Hook to manually refresh alerts
 */
export function useRefreshAlerts() {
  const queryClient = useQueryClient();

  const refreshAll = async () => {
    await queryClient.invalidateQueries({ queryKey: ['alerts'] });
  };

  const refreshActive = async () => {
    await queryClient.invalidateQueries({ queryKey: ['alerts', 'active'] });
  };

  return { refreshAll, refreshActive };
}
