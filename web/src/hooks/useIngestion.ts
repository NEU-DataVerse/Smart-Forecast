/**
 * useIngestion Hook
 * Fetches ingestion health and stats with 30-minute polling
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ingestionService } from '@/services/api';
import type { IngestionHealthResponse, IngestionStatsResponse } from '@/types/dto';

const POLLING_INTERVAL = 30 * 60 * 1000; // 30 minutes

interface IngestionData {
  health: IngestionHealthResponse | null;
  stats: IngestionStatsResponse | null;
}

interface UseIngestionOptions {
  enabled?: boolean;
}

export function useIngestion(options: UseIngestionOptions = {}) {
  const { enabled = true } = options;

  const [data, setData] = useState<IngestionData>({ health: null, stats: null });
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

      // Fetch both health and stats in parallel
      const [health, stats] = await Promise.all([
        ingestionService.getHealth(),
        ingestionService.getStats(),
      ]);

      setData({ health, stats });
      setLastUpdate(new Date());
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching ingestion data:', err);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

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

  const triggerIngestion = useCallback(async () => {
    try {
      await ingestionService.triggerAll();
      // Refetch data after triggering ingestion
      setTimeout(() => fetchData(), 2000);
    } catch (err) {
      console.error('Error triggering ingestion:', err);
    }
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
    health: data.health,
    stats: data.stats,
    loading,
    error,
    lastUpdate,
    refetch,
    triggerIngestion,
    stopPolling,
    startPolling,
  };
}
