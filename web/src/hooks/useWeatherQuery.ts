'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { weatherService } from '@/services/api';
import type {
  CurrentWeatherResponse,
  ForecastWeatherResponse,
  WeatherListResponse,
  WeatherHistoryParams,
  CompareWeatherParams,
  CompareWeatherResponse,
  WeatherTrendsResponse,
  DateRangeQuery,
} from '@/types/dto';

const ONE_HOUR = 60 * 60 * 1000;

/**
 * Fetch current weather with 1-hour auto-refresh
 * @param stationId - Optional station ID to filter by
 */
export function useCurrentWeather(stationId?: string): UseQueryResult<CurrentWeatherResponse> {
  return useQuery({
    queryKey: ['weather', 'current', stationId],
    queryFn: () => weatherService.getCurrent(stationId),
    refetchInterval: ONE_HOUR,
    staleTime: ONE_HOUR,
  });
}

/**
 * Fetch 7-day forecast
 * @param stationId - Optional station ID to filter by
 */
export function useForecastWeather(stationId?: string): UseQueryResult<ForecastWeatherResponse> {
  return useQuery({
    queryKey: ['weather', 'forecast', stationId],
    queryFn: () => weatherService.getForecast(stationId),
    staleTime: ONE_HOUR,
  });
}

/**
 * Fetch historical weather data with pagination
 */
export function useHistoryWeather(
  params: WeatherHistoryParams,
): UseQueryResult<WeatherListResponse> {
  return useQuery({
    queryKey: ['weather', 'history', params],
    queryFn: () => weatherService.getHistory(params),
    enabled: !!(params.startDate && params.endDate),
  });
}

/**
 * Compare weather across multiple stations
 */
export function useCompareWeather(
  params: CompareWeatherParams,
): UseQueryResult<CompareWeatherResponse> {
  return useQuery({
    queryKey: ['weather', 'compare', params.stationCodes],
    queryFn: () => weatherService.compareStations(params),
    enabled: params.stationCodes.length >= 2,
    staleTime: ONE_HOUR,
  });
}

/**
 * Fetch weather trends (admin only)
 */
export function useWeatherTrends(params: DateRangeQuery): UseQueryResult<WeatherTrendsResponse> {
  return useQuery({
    queryKey: ['weather', 'trends', params],
    queryFn: () => weatherService.getTrends(params),
    enabled: !!(params.startDate && params.endDate),
  });
}
