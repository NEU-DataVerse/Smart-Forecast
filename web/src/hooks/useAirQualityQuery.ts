'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { airQualityService } from '@/services/api';
import type {
  CurrentAirQualityResponse,
  ForecastAirQualityResponse,
  AirQualityListResponse,
  AirQualityQueryParams,
  AirQualityAveragesResponse,
} from '@/types/dto';

const ONE_HOUR = 60 * 60 * 1000;

/**
 * Fetch current air quality with 1-hour auto-refresh
 */
export function useCurrentAirQuality(
  params?: AirQualityQueryParams,
): UseQueryResult<CurrentAirQualityResponse> {
  return useQuery({
    queryKey: ['airQuality', 'current', params],
    queryFn: () => airQualityService.getCurrent(params),
    refetchInterval: ONE_HOUR,
    staleTime: ONE_HOUR,
  });
}

/**
 * Fetch 4-day hourly forecast
 */
export function useForecastAirQuality(
  params?: AirQualityQueryParams,
): UseQueryResult<ForecastAirQualityResponse> {
  return useQuery({
    queryKey: ['airQuality', 'forecast', params],
    queryFn: () => airQualityService.getForecast(params),
    staleTime: ONE_HOUR,
  });
}

/**
 * Fetch historical air quality data with pagination
 */
export function useHistoryAirQuality(
  params: AirQualityQueryParams,
): UseQueryResult<AirQualityListResponse> {
  return useQuery({
    queryKey: ['airQuality', 'history', params],
    queryFn: () => airQualityService.getHistory(params),
    enabled: !!(params.startDate && params.endDate),
  });
}

/**
 * Fetch air quality averages (admin only)
 */
export function useAirQualityAverages(params: {
  startDate: string;
  endDate: string;
}): UseQueryResult<AirQualityAveragesResponse> {
  return useQuery({
    queryKey: ['airQuality', 'averages', params],
    queryFn: () => airQualityService.getAverages(params),
    enabled: !!(params.startDate && params.endDate),
  });
}
