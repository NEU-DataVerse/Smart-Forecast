'use client';

import DashboardStatistics from '@/components/dashboardUI/DashboardStatistics';
import IncidentTrendChart from '@/components/dashboardUI/IncidentTrendChart';
import AlertTrendChart from '@/components/dashboardUI/AlertTrendChart';
import AlertsByLevelChart from '@/components/dashboardUI/AlertsByLevelChart';
import { useDashboardSummary } from '@/hooks/useDashboardQuery';
import { RefreshCw } from 'lucide-react';
import IngestionWidget from '@/components/admin/IngestionWidget';

export default function Dashboard() {
  // Fetch dashboard summary (stations, alerts, incidents stats)
  const {
    data: summaryData,
    isLoading: summaryLoading,
    dataUpdatedAt: summaryLastUpdate,
  } = useDashboardSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500 text-sm">System statistics and monitoring status</p>
        </div>
        {summaryLastUpdate > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <RefreshCw className="h-3 w-3" />
            Last update: {new Date(summaryLastUpdate).toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Statistics Grid */}
      <DashboardStatistics data={summaryData} isLoading={summaryLoading} />

      {/* Charts Grid - Top: Alert charts, Bottom: Incident + Ingestion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Left: Alert Trend (wider) */}
        <div className="lg:col-span-2">
          <AlertTrendChart />
        </div>
        {/* Top Right: Alerts by Level */}
        <AlertsByLevelChart />
        {/* Bottom Left: Incident Trend (wider) */}
        <div className="lg:col-span-2">
          <IncidentTrendChart />
        </div>
        {/* Bottom Right: Data Ingestion Service */}
        <IngestionWidget />
      </div>
    </div>
  );
}
