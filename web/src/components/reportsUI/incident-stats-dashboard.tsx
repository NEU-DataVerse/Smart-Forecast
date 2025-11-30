'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useIncidentStatsByType,
  useIncidentStatsByStatus,
  useIncidentTrend,
} from '@/hooks/useIncidentQuery';
import {
  IncidentType,
  IncidentStatus,
  IncidentTypeLabels,
  IncidentStatusLabels,
} from '@smart-forecast/shared';
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
import { AlertTriangle, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';

// Colors for incident types
const TYPE_COLORS: Record<string, string> = {
  [IncidentType.FLOODING]: '#3b82f6', // blue
  [IncidentType.FALLEN_TREE]: '#22c55e', // green
  [IncidentType.LANDSLIDE]: '#f59e0b', // amber
  [IncidentType.AIR_POLLUTION]: '#8b5cf6', // purple
  [IncidentType.ROAD_DAMAGE]: '#ef4444', // red
  [IncidentType.OTHER]: '#6b7280', // gray
};

// Colors for statuses
const STATUS_COLORS: Record<string, string> = {
  [IncidentStatus.PENDING]: '#f59e0b', // amber
  [IncidentStatus.VERIFIED]: '#22c55e', // green
  [IncidentStatus.REJECTED]: '#ef4444', // red
  [IncidentStatus.IN_PROGRESS]: '#3b82f6', // blue
  [IncidentStatus.RESOLVED]: '#10b981', // emerald
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

export function IncidentStatsDashboard() {
  const { data: byTypeData, isLoading: loadingType } = useIncidentStatsByType();
  const { data: byStatusData, isLoading: loadingStatus } = useIncidentStatsByStatus();
  const { data: trendData, isLoading: loadingTrend } = useIncidentTrend();

  // Calculate summary from status data
  const pendingCount = byStatusData?.find((s) => s.status === IncidentStatus.PENDING)?.count ?? 0;
  const verifiedCount = byStatusData?.find((s) => s.status === IncidentStatus.VERIFIED)?.count ?? 0;
  const rejectedCount = byStatusData?.find((s) => s.status === IncidentStatus.REJECTED)?.count ?? 0;
  const resolvedCount = byStatusData?.find((s) => s.status === IncidentStatus.RESOLVED)?.count ?? 0;
  const totalCount = byStatusData?.reduce((sum, s) => sum + s.count, 0) ?? 0;

  // Transform data for charts
  const pieData =
    byTypeData?.map((item) => ({
      name: IncidentTypeLabels[item.type as IncidentType] || item.type,
      value: item.count,
      fill: TYPE_COLORS[item.type] || '#6b7280',
    })) ?? [];

  const barData =
    byStatusData?.map((item) => ({
      name: IncidentStatusLabels[item.status as IncidentStatus] || item.status,
      count: item.count,
      fill: STATUS_COLORS[item.status] || '#6b7280',
    })) ?? [];

  // Format trend data
  const lineData =
    trendData?.map((item) => ({
      date: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      count: item.count,
    })) ?? [];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          title="Tổng báo cáo"
          value={totalCount}
          icon={AlertTriangle}
          color="bg-blue-500"
          loading={loadingStatus}
        />
        <SummaryCard
          title="Chờ xử lý"
          value={pendingCount}
          icon={Clock}
          color="bg-amber-500"
          loading={loadingStatus}
        />
        <SummaryCard
          title="Đã xác nhận"
          value={verifiedCount}
          icon={CheckCircle}
          color="bg-green-500"
          loading={loadingStatus}
        />
        <SummaryCard
          title="Đã giải quyết"
          value={resolvedCount}
          icon={TrendingUp}
          color="bg-emerald-500"
          loading={loadingStatus}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - By Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Phân bố theo loại sự cố</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingType ? (
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

        {/* Bar Chart - By Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Phân bố theo trạng thái</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStatus ? (
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
          <CardTitle className="text-lg">Xu hướng báo cáo 30 ngày qua</CardTitle>
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
                  name="Số báo cáo"
                  stroke="#3b82f6"
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
