/**
 * History Chart Component
 * Displays historical AQI trend over time from /history endpoint
 */

import { useState, useMemo } from 'react';
import { History, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useHistoryAirQuality } from '@/hooks/useAirQualityQuery';

interface HistoryChartProps {
  stationId?: string;
}

type TimeRange = '24h' | '7d' | '30d';

function getDateRange(range: TimeRange): { startDate: string; endDate: string } {
  const now = new Date();
  const endDate = now.toISOString();

  let startDate: Date;
  switch (range) {
    case '24h':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  return {
    startDate: startDate.toISOString(),
    endDate,
  };
}

function formatTime(dateStr: string, range: TimeRange): string {
  const date = new Date(dateStr);
  if (range === '24h') {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

export function HistoryChart({ stationId }: HistoryChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const dateRange = useMemo(() => getDateRange(timeRange), [timeRange]);

  const {
    data: historyData,
    isLoading,
    error,
  } = useHistoryAirQuality({
    stationId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    limit: 100,
  });

  const chartData = useMemo(() => {
    if (!historyData?.data) return [];

    return historyData.data.map((item) => ({
      time: formatTime(item.dateObserved, timeRange),
      fullTime: item.dateObserved,
      aqi: item.aqi.epaUS.index,
      aqiLevel: item.aqi.epaUS.level,
      pm25: item.pollutants.pm25 ?? 0,
      pm10: item.pollutants.pm10 ?? 0,
      co: item.pollutants.co ?? 0,
      no2: item.pollutants.no2 ?? 0,
      so2: item.pollutants.so2 ?? 0,
      o3: item.pollutants.o3 ?? 0,
    }));
  }, [historyData, timeRange]);

  const timeRangeButtons: { value: TimeRange; label: string }[] = [
    { value: '24h', label: '24 giờ' },
    { value: '7d', label: '7 ngày' },
    { value: '30d', label: '30 ngày' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-purple-500" />
            <div>
              <CardTitle>Lịch sử chất lượng không khí</CardTitle>
              <CardDescription>Xu hướng AQI theo thời gian</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-500" />
            <div className="flex gap-1">
              {timeRangeButtons.map((btn) => (
                <Button
                  key={btn.value}
                  variant={timeRange === btn.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(btn.value)}
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px] text-slate-500">
            Đang tải dữ liệu lịch sử...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px] text-red-500">
            Lỗi tải dữ liệu: {error.message}
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-slate-500">
            Không có dữ liệu lịch sử trong khoảng thời gian này
          </div>
        ) : (
          <Tabs defaultValue="aqi" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="aqi">AQI Trend</TabsTrigger>
              <TabsTrigger value="pm">PM2.5 & PM10</TabsTrigger>
              <TabsTrigger value="gases">Khí độc</TabsTrigger>
            </TabsList>

            <TabsContent value="aqi">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="aqi"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#aqiGradient)"
                    name="AQI (EPA US)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="pm">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pm25"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="PM2.5 (μg/m³)"
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pm10"
                    stroke="#f97316"
                    strokeWidth={2}
                    name="PM10 (μg/m³)"
                    dot={{ r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="gases">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="co"
                    stroke="#eab308"
                    strokeWidth={2}
                    name="CO"
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="no2"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    name="NO₂"
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="so2"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="SO₂"
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="o3"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="O₃"
                    dot={{ r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        )}

        {historyData?.meta && (
          <div className="mt-4 text-sm text-slate-500 text-center">
            Hiển thị {historyData.data.length} / {historyData.meta.total} điểm dữ liệu
          </div>
        )}
      </CardContent>
    </Card>
  );
}
