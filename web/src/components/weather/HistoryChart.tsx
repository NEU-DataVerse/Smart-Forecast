/**
 * History Chart Component
 * Displays historical weather trend over time from /history endpoint
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useHistoryWeather } from '@/hooks/useWeatherQuery';

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
  } = useHistoryWeather({
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
      temperature: item.temperature.current ?? 0,
      feelsLike: item.temperature.feelsLike ?? 0,
      humidity: item.atmospheric.humidity ?? 0,
      pressure: item.atmospheric.pressure ?? 0,
      windSpeed: item.wind.speed ?? 0,
      windGust: item.wind.gust ?? 0,
      precipitation: item.precipitation ?? 0,
      cloudiness: item.cloudiness ?? 0,
      visibility: item.visibility ? item.visibility / 1000 : 0, // Convert m to km
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
            <History className="h-5 w-5 text-blue-500" />
            <div>
              <CardTitle>Lịch sử thời tiết</CardTitle>
              <CardDescription>Xu hướng thời tiết theo thời gian</CardDescription>
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
          <Tabs defaultValue="temperature" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="temperature">Nhiệt độ</TabsTrigger>
              <TabsTrigger value="humidity">Độ ẩm</TabsTrigger>
              <TabsTrigger value="wind">Gió</TabsTrigger>
              <TabsTrigger value="precipitation">Lượng mưa</TabsTrigger>
            </TabsList>

            <TabsContent value="temperature">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} unit="°C" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number, name: string) => {
                      const labels: Record<string, string> = {
                        temperature: 'Nhiệt độ',
                        feelsLike: 'Cảm giác như',
                      };
                      return [`${value}°C`, labels[name] || name];
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fill="url(#tempGradient)"
                    name="temperature"
                  />
                  <Line
                    type="monotone"
                    dataKey="feelsLike"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="feelsLike"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="humidity">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} unit="%" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Độ ẩm']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    name="Độ ẩm (%)"
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cloudiness"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    name="Mây (%)"
                    dot={{ r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="wind">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} unit=" m/s" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number, name: string) => {
                      const labels: Record<string, string> = {
                        windSpeed: 'Tốc độ gió',
                        windGust: 'Gió giật',
                      };
                      return [`${value} m/s`, labels[name] || name];
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="windSpeed"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="windSpeed"
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="windGust"
                    stroke="#a855f7"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="windGust"
                    dot={{ r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="precipitation">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} unit=" mm" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value} mm`, 'Lượng mưa']}
                  />
                  <Bar
                    dataKey="precipitation"
                    fill="#3b82f6"
                    name="Lượng mưa (mm)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
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
