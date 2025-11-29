'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { airQualityService } from '@/services/api';
import type {
  CurrentAirQualityResponse,
  ForecastAirQualityResponse,
  AirQualityListResponse,
  AirQualityHistoryParams,
  AirQualityAveragesResponse,
  CompareAirQualityResponse,
  DateRangeQuery,
} from '@/types/dto';

const ONE_HOUR = 60 * 60 * 1000;

/**
 * Fetch current air quality with 1-hour auto-refresh
 * GET /api/v1/air-quality/current
 */
export function useCurrentAirQuality(
  stationId?: string,
): UseQueryResult<CurrentAirQualityResponse> {
  return useQuery({
    queryKey: ['airQuality', 'current', stationId],
    queryFn: () => airQualityService.getCurrent(stationId),
    refetchInterval: ONE_HOUR,
    staleTime: ONE_HOUR,
  });
}

/**
 * Fetch 4-day hourly forecast
 * GET /api/v1/air-quality/forecast
 */
export function useForecastAirQuality(
  stationId?: string,
): UseQueryResult<ForecastAirQualityResponse> {
  return useQuery({
    queryKey: ['airQuality', 'forecast', stationId],
    queryFn: () => airQualityService.getForecast(stationId),
    staleTime: ONE_HOUR,
  });
}

/**
 * Fetch historical air quality data with pagination
 * GET /api/v1/air-quality/history
 */
export function useHistoryAirQuality(
  params?: AirQualityHistoryParams,
): UseQueryResult<AirQualityListResponse> {
  return useQuery({
    queryKey: ['airQuality', 'history', params],
    queryFn: () => airQualityService.getHistory(params),
    enabled: !!(params?.startDate && params?.endDate),
  });
}

/**
 * Compare air quality across multiple stations (admin only)
 * GET /api/v1/air-quality/compare
 */
export function useCompareStations(
  stationCodes: string[],
  enabled = true,
): UseQueryResult<CompareAirQualityResponse> {
  return useQuery({
    queryKey: ['airQuality', 'compare', stationCodes],
    queryFn: () => airQualityService.compareStations(stationCodes),
    enabled: enabled && stationCodes.length >= 2,
    staleTime: ONE_HOUR,
  });
}

/**
 * Fetch air quality averages (admin only)
 * GET /api/v1/air-quality/stats/averages
 */
export function useAirQualityAverages(
  params: DateRangeQuery,
): UseQueryResult<AirQualityAveragesResponse> {
  return useQuery({
    queryKey: ['airQuality', 'averages', params],
    queryFn: () => airQualityService.getAverages(params),
    enabled: !!(params.startDate && params.endDate),
  });
}
