/**
 * useStations Hook
 * Fetches stations data with 30-minute polling
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { stationsService } from '@/services/api';
import type { ObservationStation, StationQueryParams } from '@/types/dto';

const POLLING_INTERVAL = 30 * 60 * 1000; // 30 minutes

interface UseStationsOptions {
  params?: StationQueryParams;
  enabled?: boolean;
}

export function useStations(options: UseStationsOptions = {}) {
  const { params, enabled = true } = options;

  const [data, setData] = useState<ObservationStation[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef<boolean>(true);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);
      const result = await stationsService.list(params);
      setData(result);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching stations data:', err);
    } finally {
      setLoading(false);
    }
  }, [params, enabled]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    isPollingRef.current = true;
    intervalRef.current = setInterval(() => {
      if (isPollingRef.current) {
        fetchData();
      }
    }, POLLING_INTERVAL);
  }, [fetchData]);

  const stopPolling = useCallback(() => {
    isPollingRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (enabled) {
      // Fetch immediately on mount
      fetchData();
      // Start polling
      startPolling();
    }

    // Cleanup on unmount
    return () => {
      stopPolling();
    };
  }, [enabled, fetchData, startPolling, stopPolling]);

  return {
    data,
    loading,
    error,
    lastUpdate,
    refetch,
    stopPolling,
    startPolling,
  };
}
