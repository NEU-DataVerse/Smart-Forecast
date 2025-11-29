'use client';

import { recentReports, activeAlerts } from '@/services/data/dashboard.api';
import { useState } from 'react';
import SummaryCards from '@/components/dashboardUI/SummaryCard';
import RecentReports from '@/components/dashboardUI/RecentReport';
import AlertsActive from '@/components/dashboardUI/Alert';
import DetailsReport from '@/components/dashboardUI/DetailReport';
import { useCurrentAirQuality } from '@/hooks/useAirQualityQuery';
import { useCurrentWeather } from '@/hooks/useWeatherQuery';
import { CardSkeleton } from '@/components/shared/Skeleton';
import { Cloud, Wind, RefreshCw } from 'lucide-react';
import IngestionWidget from '@/components/admin/IngestionWidget';

export default function Dashboard() {
  const [selectedReport, setSelectedReport] = useState<(typeof recentReports)[0] | null>(null);

  // Fetch real-time data using React Query hooks
  const {
    data: airQualityData,
    isLoading: airQualityLoading,
    error: airQualityError,
    dataUpdatedAt: airQualityLastUpdate,
  } = useCurrentAirQuality();
  const {
    data: weatherData,
    isLoading: weatherLoading,
    error: weatherError,
    dataUpdatedAt: weatherLastUpdate,
  } = useCurrentWeather();

  // Calculate summary stats from real data
  const getSummaryCards = () => {
    const cards = [];

    // Air Quality Card
    if (airQualityData?.data?.length) {
      const avgAQI = Math.round(
        airQualityData.data.reduce((sum, item) => sum + (item.aqi.epaUS.index || 0), 0) /
          airQualityData.data.length,
      );
      const aqiLevel = airQualityData.data[0]?.aqi.epaUS.level || 'Unknown';

      cards.push({
        title: 'Air Quality Index',
        value: avgAQI.toString(),
        description: aqiLevel,
        icon: Wind,
        color: avgAQI > 100 ? 'text-red-500' : avgAQI > 50 ? 'text-orange-500' : 'text-green-500',
        bgColor: avgAQI > 100 ? 'bg-red-50' : avgAQI > 50 ? 'bg-orange-50' : 'bg-green-50',
      });
    }

    // Weather Card
    if (weatherData?.data?.length) {
      const avgTemp = (
        weatherData.data.reduce((sum, item) => sum + (item.temperature.current || 0), 0) /
        weatherData.data.length
      ).toFixed(1);
      const weatherType = weatherData.data[0]?.weather.type || 'Clear';

      cards.push({
        title: 'Temperature',
        value: `${avgTemp}°C`,
        description: weatherType,
        icon: Cloud,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
      });
    }

    return cards;
  };

  const summaryCards = getSummaryCards();
  const isLoading = airQualityLoading || weatherLoading;
  const hasError = airQualityError || weatherError;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500 text-sm">
            Real-time weather monitoring and system analytics
          </p>
        </div>
        {(airQualityLastUpdate || weatherLastUpdate) && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <RefreshCw className="h-3 w-3" />
            Last update:{' '}
            {new Date(airQualityLastUpdate || weatherLastUpdate || Date.now()).toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {isLoading && summaryCards.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : hasError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-medium">Failed to load dashboard data</p>
          <p className="text-sm mt-1">Please check your connection and try again.</p>
        </div>
      ) : (
        <SummaryCards cards={summaryCards} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Reports */}
        <div className="lg:col-span-2">
          <RecentReports reports={recentReports} setSelectedReport={setSelectedReport} />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Active Alerts */}
          <AlertsActive alerts={activeAlerts} />

          {/* Ingestion Widget */}
          <IngestionWidget />
        </div>
      </div>

      {/* Report Details Dialog */}
      <DetailsReport selectedReport={selectedReport} setSelectedReport={setSelectedReport} />
    </div>
  );
}
