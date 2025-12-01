'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAlertStats, useAlertTrend } from '@/hooks/useAlertQuery';
import { AlertLevel, AlertLevelLabels } from '@smart-forecast/shared';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import { AlertTriangle, AlertCircle, AlertOctagon, Info } from 'lucide-react';

// Colors for alert levels
const LEVEL_COLORS: Record<string, string> = {
  [AlertLevel.LOW]: '#22c55e', // green
  [AlertLevel.MEDIUM]: '#f59e0b', // amber
  [AlertLevel.HIGH]: '#f97316', // orange
  [AlertLevel.CRITICAL]: '#ef4444', // red
};

// Summary card component
function SummaryCard({
  title,
  value,
  icon: Icon,
  color,
  loading,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <p className="text-2xl font-bold text-slate-900">{value}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AlertStatsDashboard() {
  const { data: statsData, isLoading: loadingStats } = useAlertStats();
  const { data: trendData, isLoading: loadingTrend } = useAlertTrend();

  // Extract data from stats
  const byLevel = statsData?.byLevel ?? { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };

  // Transform data for charts
  const pieData = Object.entries(byLevel)
    .map(([level, count]) => ({
      name: AlertLevelLabels[level as AlertLevel] || level,
      value: count,
      fill: LEVEL_COLORS[level] || '#6b7280',
    }))
    .filter((item) => item.value > 0);

  const barData = Object.entries(byLevel).map(([level, count]) => ({
    name: AlertLevelLabels[level as AlertLevel] || level,
    count: count,
    fill: LEVEL_COLORS[level] || '#6b7280',
  }));

  // Format trend data
  const lineData =
    trendData?.map((item) => ({
      date: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      count: item.count,
    })) ?? [];

  return (
    <div className="space-y-6">
      {/* Summary Cards - By Level */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          title="Mức khẩn cấp"
          value={byLevel.CRITICAL}
          icon={AlertOctagon}
          color="bg-red-500"
          loading={loadingStats}
        />
        <SummaryCard
          title="Mức cao"
          value={byLevel.HIGH}
          icon={AlertCircle}
          color="bg-orange-500"
          loading={loadingStats}
        />
        <SummaryCard
          title="Mức trung bình"
          value={byLevel.MEDIUM}
          icon={AlertTriangle}
          color="bg-amber-500"
          loading={loadingStats}
        />
        <SummaryCard
          title="Mức thấp"
          value={byLevel.LOW}
          icon={Info}
          color="bg-green-500"
          loading={loadingStats}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - By Level */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Phân bố theo mức độ</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Skeleton className="h-64 w-full" />
            ) : pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500">
                Không có dữ liệu
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart - By Level */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Số lượng theo mức độ</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Skeleton className="h-64 w-full" />
            ) : barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500">
                Không có dữ liệu
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Line Chart - Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Xu hướng cảnh báo 30 ngày qua</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTrend ? (
            <Skeleton className="h-64 w-full" />
          ) : lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Số cảnh báo"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500">
              Không có dữ liệu
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
