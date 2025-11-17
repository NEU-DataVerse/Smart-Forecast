'use client';
import { summaryCards, recentReports, activeAlerts } from '@/services/data';
import { useState } from 'react';
import SummaryCards from '@/components/SummaryCard';
import RecentReports from '@/components/RecentReport';
import AlertsActive from '@/components/Alert';
import DetailsReport from '@/components/DetailReport';

export default function Dashboard() {
  const [selectedReport, setSelectedReport] = useState<
    (typeof recentReports)[0] | null
  >(null);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500 text-sm">
          Real-time weather monitoring and system analytics
        </p>
      </div>

      {/* Summary Cards */}
      <SummaryCards cards={summaryCards} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Reports */}
        <RecentReports
          reports={recentReports}
          setSelectedReport={setSelectedReport}
        />

        {/* Active Alerts */}
        <AlertsActive alerts={activeAlerts} />
      </div>

      {/* Report Details Dialog */}
      <DetailsReport
        selectedReport={selectedReport}
        setSelectedReport={setSelectedReport}
      />
    </div>
  );
}
