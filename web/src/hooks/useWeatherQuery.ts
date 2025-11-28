'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { weatherService } from '@/services/api';
import type {
  CurrentWeatherResponse,
  ForecastWeatherResponse,
  WeatherListResponse,
  WeatherQueryParams,
  WeatherTrendsResponse,
} from '@/types/dto';

const ONE_HOUR = 60 * 60 * 1000;

/**
 * Fetch current weather with 1-hour auto-refresh
 */
export function useCurrentWeather(
  params?: WeatherQueryParams,
): UseQueryResult<CurrentWeatherResponse> {
  return useQuery({
    queryKey: ['weather', 'current', params],
    queryFn: () => weatherService.getCurrent(params),
    refetchInterval: ONE_HOUR,
    staleTime: ONE_HOUR,
  });
}

/**
 * Fetch 7-day forecast
 */
export function useForecastWeather(
  params?: WeatherQueryParams,
): UseQueryResult<ForecastWeatherResponse> {
  return useQuery({
    queryKey: ['weather', 'forecast', params],
    queryFn: () => weatherService.getForecast(params),
    staleTime: ONE_HOUR,
  });
}

/**
 * Fetch historical weather data with pagination
 */
export function useHistoryWeather(params: WeatherQueryParams): UseQueryResult<WeatherListResponse> {
  return useQuery({
    queryKey: ['weather', 'history', params],
    queryFn: () => weatherService.getHistory(params),
    enabled: !!(params.startDate && params.endDate),
  });
}

/**
 * Fetch weather trends (admin only)
 */
export function useWeatherTrends(params: {
  startDate: string;
  endDate: string;
}): UseQueryResult<WeatherTrendsResponse> {
  return useQuery({
    queryKey: ['weather', 'trends', params],
    queryFn: () => weatherService.getTrends(params),
    enabled: !!(params.startDate && params.endDate),
  });
}
