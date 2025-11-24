/**
 * useWeather Hook
 * Fetches weather data with 30-minute polling
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { weatherService } from '@/services/api';
import type { CurrentWeatherResponse, WeatherQueryParams } from '@/types/dto';

const POLLING_INTERVAL = 30 * 60 * 1000; // 30 minutes

interface UseWeatherOptions {
  params?: WeatherQueryParams;
  enabled?: boolean;
}

export function useWeather(options: UseWeatherOptions = {}) {
  const { params, enabled = true } = options;

  const [data, setData] = useState<CurrentWeatherResponse | null>(null);
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
      const result = await weatherService.getCurrent(params);
      setData(result);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching weather data:', err);
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
