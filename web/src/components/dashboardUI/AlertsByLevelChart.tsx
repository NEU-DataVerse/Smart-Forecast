'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAlertStats } from '@/hooks/useAlertQuery';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Shield } from 'lucide-react';

// Alert level colors (matching shared package)
const LEVEL_COLORS = {
  LOW: '#10B981', // green
  MEDIUM: '#F59E0B', // yellow/amber
  HIGH: '#F97316', // orange
  CRITICAL: '#EF4444', // red
};

const LEVEL_LABELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

export default function AlertsByLevelChart() {
  const { data: stats, isLoading, error } = useAlertStats();

  // Transform data for pie chart
  const chartData = stats?.byLevel
    ? Object.entries(stats.byLevel)
        .map(([level, count]) => ({
          name: LEVEL_LABELS[level as keyof typeof LEVEL_LABELS],
          value: count,
          level,
          color: LEVEL_COLORS[level as keyof typeof LEVEL_COLORS],
        }))
        .filter((item) => item.value > 0) // Only show levels with alerts
    : [];

  const totalAlerts = stats?.total || 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Alerts by Level</CardTitle>
            <CardDescription className="text-xs">Distribution of alert severity</CardDescription>
          </div>
          <Shield className="h-5 w-5 text-slate-400" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-pulse text-slate-400">Loading chart...</div>
          </div>
        ) : error ? (
          <div className="h-[200px] flex items-center justify-center text-red-500 text-sm">
            Failed to load alert statistics
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm">
            No alerts to display
          </div>
        ) : (
          <div className="relative">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value: number, name: string) => [`${value} alerts`, name]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center -mt-8">
                <p className="text-2xl font-bold text-slate-800">{totalAlerts}</p>
                <p className="text-xs text-slate-500">Total</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
