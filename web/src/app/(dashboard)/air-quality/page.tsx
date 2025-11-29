'use client';

import { useState, useMemo, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StationSelector, LoadingState, ErrorState } from '@/components/shared';
import {
  AQICard,
  PollutantsGrid,
  ForecastCharts,
  AirQualityAverages,
  AQIMapView,
  HistoryChart,
  CompareStations,
} from '@/components/air-quality';
import {
  useCurrentAirQuality,
  useForecastAirQuality,
  useAirQualityAverages,
} from '@/hooks/useAirQualityQuery';

export default function AirQualityPage() {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString(),
  });

  // Fetch all current air quality data (for map)
  const {
    data: allCurrentData,
    isLoading: currentLoading,
    error: currentError,
    refetch: refetchCurrent,
  } = useCurrentAirQuality();

  // Auto-select first station on initial load
  useEffect(() => {
    if (allCurrentData?.data && allCurrentData.data.length > 0 && !selectedStation) {
      setSelectedStation(allCurrentData.data[0].stationId);
    }
  }, [allCurrentData, selectedStation]);

  // Fetch forecast for selected station only
  const { data: forecastData, isLoading: forecastLoading } = useForecastAirQuality(
    selectedStation || undefined,
  );

  // Fetch averages (admin only)
  const { data: averagesData, isLoading: averagesLoading } = useAirQualityAverages(dateRange);

  // Get current station data
  const currentStationData = useMemo(() => {
    if (!selectedStation || !allCurrentData?.data) return null;
    return allCurrentData.data.find((d) => d.stationId === selectedStation);
  }, [selectedStation, allCurrentData]);

  // Process current AQI data for selected station
  const aqiData = useMemo(() => {
    if (!currentStationData) return null;
    return {
      openWeather: currentStationData.aqi.openWeather,
      epaUS: currentStationData.aqi.epaUS,
      pollutants: currentStationData.pollutants,
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
        aqi: item.aqi.epaUS.index,
        pm25: item.pollutants.pm25 || 0,
        pm10: item.pollutants.pm10 || 0,
        co: item.pollutants.co || 0,
        no2: item.pollutants.no2 || 0,
        so2: item.pollutants.so2 || 0,
        o3: item.pollutants.o3 || 0,
      };
    });
  }, [forecastData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Air Quality</h2>
          <p className="text-slate-500">Real-time air quality monitoring and forecasts</p>
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
          {currentLoading && <LoadingState message="Loading air quality data..." />}
          {currentError && (
            <ErrorState
              message="Failed to load air quality data"
              onRetry={() => refetchCurrent()}
            />
          )}
          {!currentLoading && !currentError && allCurrentData?.data && (
            <AQIMapView
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
                      backgroundColor:
                        currentStationData.aqi.epaUS.index <= 50
                          ? '#10b981'
                          : currentStationData.aqi.epaUS.index <= 100
                            ? '#eab308'
                            : currentStationData.aqi.epaUS.index <= 150
                              ? '#f97316'
                              : currentStationData.aqi.epaUS.index <= 200
                                ? '#ef4444'
                                : currentStationData.aqi.epaUS.index <= 300
                                  ? '#a855f7'
                                  : '#7f1d1d',
                    }}
                  />
                  <span className="text-sm font-bold text-slate-900">
                    AQI: {currentStationData.aqi.epaUS.index}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({currentStationData.aqi.epaUS.level})
                  </span>
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

      {/* Current AQI Cards - Only show when station is selected */}
      {!currentLoading && !currentError && aqiData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AQICard
              index={aqiData.epaUS.index}
              level={aqiData.epaUS.level}
              location={aqiData.location}
              timestamp={aqiData.timestamp}
              scale="epa"
            />
            <AQICard
              index={aqiData.openWeather.index}
              level={aqiData.openWeather.level}
              location={aqiData.location}
              timestamp={aqiData.timestamp}
              scale="openweather"
            />
          </div>

          {/* Pollutants Grid */}
          <PollutantsGrid pollutants={aqiData.pollutants} />
        </>
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
            <ForecastCharts data={forecastChartData} />
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

      {/* Admin Averages Panel */}
      <AirQualityAverages
        data={averagesData}
        isLoading={averagesLoading}
        onDateRangeChange={(start, end) => setDateRange({ startDate: start, endDate: end })}
      />
    </div>
  );
}
