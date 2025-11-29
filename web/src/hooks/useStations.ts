/**
 * useStations Hook
 * Manages station data with CRUD operations
 * Synced with backend/src/modules/stations/station.controller.ts
 */

import { useState, useEffect, useCallback } from 'react';
import { stationsService } from '@/services/api';
import type {
  ObservationStation,
  StationQueryParams,
  CreateStationDto,
  UpdateStationDto,
  StationStatsResponse,
} from '@/types/dto';

interface UseStationsOptions {
  params?: StationQueryParams;
  enabled?: boolean;
  autoFetch?: boolean;
}

interface NearestStationResult {
  coordinates: { lat: number; lon: number };
  radius: number;
  count: number;
  stations: Array<ObservationStation & { distance: number }>;
}

export function useStations(options: UseStationsOptions = {}) {
  const { params, enabled = true, autoFetch = true } = options;

  const [stations, setStations] = useState<ObservationStation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  /**
   * Fetch all stations with optional filters
   */
  const fetchStations = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);
      const result = await stationsService.list(params);
      setStations(result);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching stations:', err);
    } finally {
      setLoading(false);
    }
  }, [params, enabled]);

  /**
   * Get active stations only
   */
  const fetchActiveStations = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);
      const result = await stationsService.getActive();
      setStations(result);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching active stations:', err);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  /**
   * Get station by ID
   */
  const getStation = useCallback(async (id: string): Promise<ObservationStation | null> => {
    try {
      setError(null);
      const station = await stationsService.getById(id);
      return station;
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching station:', err);
      return null;
    }
  }, []);

  /**
   * Find nearest stations by GPS coordinates
   */
  const findNearest = useCallback(
    async (
      lat: number,
      lon: number,
      radius?: number,
      limit?: number,
    ): Promise<NearestStationResult | null> => {
      try {
        setError(null);
        return await stationsService.findNearest(lat, lon, radius, limit);
      } catch (err) {
        setError(err as Error);
        console.error('Error finding nearest stations:', err);
        return null;
      }
    },
    [],
  );

  /**
   * Create a new station
   */
  const createStation = useCallback(
    async (data: CreateStationDto): Promise<ObservationStation | null> => {
      try {
        setError(null);
        const newStation = await stationsService.create(data);
        // Refresh the list
        await fetchStations();
        return newStation;
      } catch (err) {
        setError(err as Error);
        console.error('Error creating station:', err);
        return null;
      }
    },
    [fetchStations],
  );

  /**
   * Update a station
   */
  const updateStation = useCallback(
    async (id: string, data: UpdateStationDto): Promise<ObservationStation | null> => {
      try {
        setError(null);
        const updatedStation = await stationsService.update(id, data);
        // Update local state
        setStations((prev) =>
          prev.map((station) => (station.id === id ? updatedStation : station)),
        );
        return updatedStation;
      } catch (err) {
        setError(err as Error);
        console.error('Error updating station:', err);
        return null;
      }
    },
    [],
  );

  /**
   * Delete a station
   */
  const deleteStation = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await stationsService.delete(id);
      // Remove from local state
      setStations((prev) => prev.filter((station) => station.id !== id));
      return true;
    } catch (err) {
      setError(err as Error);
      console.error('Error deleting station:', err);
      return false;
    }
  }, []);

  /**
   * Activate a station
   */
  const activateStation = useCallback(async (id: string): Promise<ObservationStation | null> => {
    try {
      setError(null);
      const updatedStation = await stationsService.activate(id);
      // Update local state
      setStations((prev) => prev.map((station) => (station.id === id ? updatedStation : station)));
      return updatedStation;
    } catch (err) {
      setError(err as Error);
      console.error('Error activating station:', err);
      return null;
    }
  }, []);

  /**
   * Deactivate a station
   */
  const deactivateStation = useCallback(async (id: string): Promise<ObservationStation | null> => {
    try {
      setError(null);
      const updatedStation = await stationsService.deactivate(id);
      // Update local state
      setStations((prev) => prev.map((station) => (station.id === id ? updatedStation : station)));
      return updatedStation;
    } catch (err) {
      setError(err as Error);
      console.error('Error deactivating station:', err);
      return null;
    }
  }, []);

  /**
   * Set station to maintenance mode
   */
  const setMaintenanceMode = useCallback(async (id: string): Promise<ObservationStation | null> => {
    try {
      setError(null);
      const updatedStation = await stationsService.setMaintenance(id);
      // Update local state
      setStations((prev) => prev.map((station) => (station.id === id ? updatedStation : station)));
      return updatedStation;
    } catch (err) {
      setError(err as Error);
      console.error('Error setting maintenance mode:', err);
      return null;
    }
  }, []);

  /**
   * Get station statistics
   */
  const getStatistics = useCallback(async (): Promise<StationStatsResponse | null> => {
    try {
      setError(null);
      const stats = await stationsService.getStats();
      return stats;
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching statistics:', err);
      return null;
    }
  }, []);

  /**
   * Refresh station list
   */
  const refetch = useCallback(() => {
    fetchStations();
  }, [fetchStations]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (enabled && autoFetch) {
      fetchStations();
    }
  }, [enabled, autoFetch, fetchStations]);

  return {
    // Data
    stations,
    loading,
    error,
    lastUpdate,

    // Query operations
    refetch,
    fetchStations,
    fetchActiveStations,
    getStation,
    findNearest,
    getStatistics,

    // Mutation operations
    createStation,
    updateStation,
    deleteStation,
    activateStation,
    deactivateStation,
    setMaintenanceMode,
  };
}
