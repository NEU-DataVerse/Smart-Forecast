'use client';

import { useState, useMemo, useEffect } from 'react';
import { RefreshCw, Thermometer, Droplets, Wind, Gauge, CloudRain, Cloud } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StationSelector, LoadingState, ErrorState } from '@/components/shared';
import {
  WeatherMetricCard,
  WeatherCharts,
  WeatherTrends,
  HistoryChart,
  CompareStations,
  WeatherMapView,
} from '@/components/weather';
import { useCurrentWeather, useForecastWeather, useWeatherTrends } from '@/hooks/useWeatherQuery';

function getTemperatureColor(temp: number): string {
  if (temp <= 0) return '#3b82f6';
  if (temp <= 10) return '#06b6d4';
  if (temp <= 20) return '#22c55e';
  if (temp <= 25) return '#84cc16';
  if (temp <= 30) return '#eab308';
  if (temp <= 35) return '#f97316';
  return '#ef4444';
}

function getTemperatureLabel(temp: number): string {
  if (temp <= 0) return 'Freezing';
  if (temp <= 10) return 'Cold';
  if (temp <= 20) return 'Cool';
  if (temp <= 25) return 'Mild';
  if (temp <= 30) return 'Warm';
  if (temp <= 35) return 'Hot';
  return 'Very Hot';
}

export default function WeatherPage() {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString(),
  });

  // Fetch all current weather data (for map)
  const {
    data: allCurrentData,
    isLoading: currentLoading,
    error: currentError,
    refetch: refetchCurrent,
  } = useCurrentWeather();

  // Auto-select first station on initial load
  useEffect(() => {
    if (allCurrentData?.data && allCurrentData.data.length > 0 && !selectedStation) {
      setSelectedStation(allCurrentData.data[0].stationId);
    }
  }, [allCurrentData, selectedStation]);

  // Fetch forecast for selected station only
  const { data: forecastData, isLoading: forecastLoading } = useForecastWeather(
    selectedStation || undefined,
  );

  // Fetch trends (admin only)
  const { data: trendsData, isLoading: trendsLoading } = useWeatherTrends(dateRange);

  // Get current station data
  const currentStationData = useMemo(() => {
    if (!selectedStation || !allCurrentData?.data) return null;
    return allCurrentData.data.find((d) => d.stationId === selectedStation);
  }, [selectedStation, allCurrentData]);

  // Process current weather data for selected station
  const weatherData = useMemo(() => {
    if (!currentStationData) return null;
    return {
      temperature: currentStationData.temperature.current || 0,
      feelsLike: currentStationData.temperature.feelsLike || 0,
      humidity: currentStationData.atmospheric?.humidity || 0,
      pressure: currentStationData.atmospheric?.pressure || 0,
      windSpeed: currentStationData.wind?.speed || 0,
      windDirection: currentStationData.wind?.direction || 0,
      rainfall: currentStationData.precipitation || 0,
      clouds: currentStationData.cloudiness || 0,
      visibility: currentStationData.visibility || 0,
      location: currentStationData.address || 'Unknown Location',
      timestamp: new Date(currentStationData.dateObserved).toLocaleString(),
    };
  }, [currentStationData]);

  // Process forecast data for charts
  const forecastChartData = useMemo(() => {
    if (!forecastData?.data) return [];

    return forecastData.data.slice(0, 24).map((item) => {
      const date = new Date(item.dateObserved);
      return {
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        temperature: item.temperature?.current || 0,
        humidity: item.atmospheric?.humidity || 0,
        pressure: item.atmospheric?.pressure || 0,
        windSpeed: item.wind?.speed || 0,
        rainfall: item.precipitation || 0,
        clouds: item.cloudiness || 0,
        visibility: item.visibility ? item.visibility / 1000 : 0,
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

      {/* Map + Station Selector Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map View - 2/3 width */}
        <div className="lg:col-span-2">
          {currentLoading && <LoadingState message="Loading weather data..." />}
          {currentError && (
            <ErrorState message="Failed to load weather data" onRetry={() => refetchCurrent()} />
          )}
          {!currentLoading && !currentError && allCurrentData?.data && (
            <WeatherMapView
              data={allCurrentData.data}
              selectedStationId={selectedStation}
              onStationSelect={setSelectedStation}
              height="500px"
            />
          )}
        </div>

        {/* Station Selector - 1/3 width */}
        <Card>
          <CardHeader>
            <CardTitle>Select Station</CardTitle>
          </CardHeader>
          <CardContent>
            <StationSelector
              value={selectedStation || 'all'}
              onChange={(value) => setSelectedStation(value === 'all' ? null : value)}
            />
            {selectedStation && currentStationData && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-semibold text-slate-700">Current Selection:</p>
                <p className="text-xs text-slate-600 mt-1">
                  {currentStationData.address || 'Unknown Location'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: getTemperatureColor(
                        currentStationData.temperature.current ?? 0,
                      ),
                    }}
                  />
                  <span className="text-sm font-bold text-slate-900">
                    {currentStationData.temperature.current?.toFixed(1)}°C
                  </span>
                  <span className="text-xs text-slate-500">
                    ({getTemperatureLabel(currentStationData.temperature.current ?? 0)})
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400">Humidity:</span>{' '}
                    {currentStationData.atmospheric?.humidity?.toFixed(0)}%
                  </div>
                  <div>
                    <span className="text-slate-400">Wind:</span>{' '}
                    {currentStationData.wind?.speed?.toFixed(1)} m/s
                  </div>
                </div>
              </div>
            )}
            {!selectedStation && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Click on a marker on the map or select from the dropdown
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Current Weather Metrics - Only show when station is selected */}
      {!currentLoading && !currentError && weatherData && (
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
      )}

      {/* Message when no station selected */}
      {!selectedStation && !currentLoading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-slate-500">
              Select a station on the map to view detailed information
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tabs for Forecast, History, Compare */}
      <Tabs defaultValue="forecast" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forecast">Dự báo 24h</TabsTrigger>
          <TabsTrigger value="history">Lịch sử</TabsTrigger>
          <TabsTrigger value="compare">So sánh trạm</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast">
          {forecastLoading && <LoadingState message="Loading forecast..." />}
          {!forecastLoading && forecastChartData.length > 0 && (
            <WeatherCharts data={forecastChartData} />
          )}
          {!forecastLoading && forecastChartData.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-slate-500">Không có dữ liệu dự báo cho trạm này</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <HistoryChart stationId={selectedStation || undefined} />
        </TabsContent>

        <TabsContent value="compare">
          <CompareStations />
        </TabsContent>
      </Tabs>

      {/* Admin Trends Panel - outside of tabs, similar to air-quality */}
      <WeatherTrends
        data={trendsData}
        isLoading={trendsLoading}
        onDateRangeChange={(start, end) => setDateRange({ startDate: start, endDate: end })}
      />
    </div>
  );
}
