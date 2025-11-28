'use client';

import { useState, useMemo } from 'react';
import { RefreshCw, Thermometer, Droplets, Wind, Gauge, CloudRain, Cloud } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StationSelector, LoadingState, ErrorState } from '@/components/shared';
import { WeatherMetricCard, WeatherCharts, WeatherTrends } from '@/components/weather';
import { useCurrentWeather, useForecastWeather, useWeatherTrends } from '@/hooks/useWeatherQuery';

export default function WeatherPage() {
  const [selectedStation, setSelectedStation] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString(),
  });

  // Fetch current weather
  const {
    data: currentData,
    isLoading: currentLoading,
    error: currentError,
    refetch: refetchCurrent,
  } = useCurrentWeather(selectedStation !== 'all' ? { stationId: selectedStation } : undefined);

  // Fetch forecast
  const { data: forecastData, isLoading: forecastLoading } = useForecastWeather(
    selectedStation !== 'all' ? { stationId: selectedStation } : undefined,
  );

  // Fetch trends (admin only)
  const { data: trendsData, isLoading: trendsLoading } = useWeatherTrends(dateRange);

  // Process current weather data
  const weatherData = useMemo(() => {
    if (!currentData?.data?.[0]) return null;
    const current = currentData.data[0];
    return {
      temperature: current.temperature.current || 0,
      feelsLike: current.temperature.feelsLike || 0,
      humidity: current.atmospheric?.humidity || 0,
      pressure: current.atmospheric?.pressure || 0,
      windSpeed: current.wind?.speed || 0,
      windDirection: current.wind?.direction || 0,
      rainfall: current.precipitation || 0,
      clouds: 0,
      visibility: current.visibility || 0,
      location: current.address || 'Unknown Location',
      timestamp: new Date(current.dateObserved).toLocaleString(),
    };
  }, [currentData]);

  // Process forecast data for charts
  const forecastChartData = useMemo(() => {
    if (!forecastData?.data) return [];

    return forecastData.data.slice(0, 24).map((item: any) => {
      const date = new Date(item.dateObserved);
      return {
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        temperature: item.temperature?.current || 0,
        humidity: item.atmospheric?.humidity || 0,
        pressure: item.atmospheric?.pressure || 0,
        windSpeed: item.wind?.speed || 0,
        rainfall: item.precipitation || 0,
        clouds: 0,
      };
    });
  }, [forecastData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Weather</h2>
          <p className="text-slate-500">Real-time weather monitoring and forecasts</p>
        </div>
        <Button onClick={() => refetchCurrent()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Station Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Station</CardTitle>
        </CardHeader>
        <CardContent>
          <StationSelector value={selectedStation} onChange={setSelectedStation} />
        </CardContent>
      </Card>

      {/* Loading/Error States */}
      {currentLoading && <LoadingState message="Loading weather data..." />}
      {currentError && (
        <ErrorState message="Failed to load weather data" onRetry={() => refetchCurrent()} />
      )}

      {/* Current Weather Metrics */}
      {!currentLoading && !currentError && weatherData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <WeatherMetricCard
              icon={Thermometer}
              title="Temperature"
              value={weatherData.temperature.toFixed(1)}
              unit="°C"
              subValue={`Feels like ${weatherData.feelsLike.toFixed(1)}°C`}
              color="text-orange-500"
            />
            <WeatherMetricCard
              icon={Droplets}
              title="Humidity"
              value={weatherData.humidity.toFixed(0)}
              unit="%"
              color="text-cyan-500"
            />
            <WeatherMetricCard
              icon={Wind}
              title="Wind Speed"
              value={weatherData.windSpeed.toFixed(1)}
              unit="m/s"
              subValue={`Direction: ${weatherData.windDirection}°`}
              color="text-blue-500"
            />
            <WeatherMetricCard
              icon={Gauge}
              title="Pressure"
              value={weatherData.pressure.toFixed(0)}
              unit="hPa"
              color="text-green-500"
            />
            <WeatherMetricCard
              icon={CloudRain}
              title="Rainfall"
              value={weatherData.rainfall.toFixed(1)}
              unit="mm"
              color="text-blue-600"
            />
            <WeatherMetricCard
              icon={Cloud}
              title="Cloud Cover"
              value={weatherData.clouds.toFixed(0)}
              unit="%"
              color="text-slate-500"
            />
          </div>

          {/* Location & Time Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-slate-500">Current Location</p>
                <p className="text-xl font-semibold text-slate-900">{weatherData.location}</p>
                <p className="text-xs text-slate-400 mt-1">Last updated: {weatherData.timestamp}</p>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Forecast Charts */}
      {forecastLoading && <LoadingState message="Loading forecast..." />}
      {!forecastLoading && forecastChartData.length > 0 && (
        <WeatherCharts data={forecastChartData} />
      )}

      {/* Admin Trends Panel */}
      <WeatherTrends
        data={trendsData}
        isLoading={trendsLoading}
        onDateRangeChange={(start, end) => setDateRange({ startDate: start, endDate: end })}
      />
    </div>
  );
}
