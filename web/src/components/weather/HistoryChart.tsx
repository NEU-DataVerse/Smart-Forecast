/**
 * History Chart Component
 * Displays historical weather trend over time from /history endpoint
 * Supports time-based aggregation: 24h (hourly), 7d (6h intervals), 30d (daily)
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
import type { AggregationInterval } from '@/types/dto';

interface HistoryChartProps {
  stationId?: string;
}

type TimeRange = '24h' | '7d' | '30d';

// Common tooltip style matching AlertTrendChart
const tooltipStyle = {
  contentStyle: {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  labelStyle: { color: '#334155', fontWeight: 500 },
};

/**
 * Get the appropriate aggregation interval based on time range
 * - 24h: hourly data (~24 points)
 * - 7d: 6-hour intervals (~28 points)
 * - 30d: daily data (~30 points)
 */
function getIntervalForRange(range: TimeRange): AggregationInterval {
  switch (range) {
    case '24h':
      return 'hourly';
    case '7d':
      return '6h';
    case '30d':
      return 'daily';
    default:
      return 'hourly';
  }
}

/**
 * Get appropriate limit based on time range
 */
function getLimitForRange(range: TimeRange): number {
  switch (range) {
    case '24h':
      return 30; // ~24 hourly points + buffer
    case '7d':
      return 35; // ~28 six-hour points + buffer
    case '30d':
      return 35; // ~30 daily points + buffer
    default:
      return 50;
  }
}

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

/**
 * Format time label based on aggregation interval
 */
function formatTime(dateStr: string, range: TimeRange): string {
  const date = new Date(dateStr);

  switch (range) {
    case '24h':
      // Show hour only (e.g., "14:00")
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    case '7d':
      // Show day + hour (e.g., "25/11 06:00")
      return `${date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
    case '30d':
      // Show day/month only (e.g., "25/11")
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    default:
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  }
}

/**
 * Get interval description text
 */
function getIntervalDescription(range: TimeRange): string {
  switch (range) {
    case '24h':
      return 'Dữ liệu theo giờ';
    case '7d':
      return 'Trung bình mỗi 6 giờ';
    case '30d':
      return 'Trung bình theo ngày';
    default:
      return '';
  }
}

export function HistoryChart({ stationId }: HistoryChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const dateRange = useMemo(() => getDateRange(timeRange), [timeRange]);
  const interval = useMemo(() => getIntervalForRange(timeRange), [timeRange]);
  const limit = useMemo(() => getLimitForRange(timeRange), [timeRange]);

  const {
    data: historyData,
    isLoading,
    error,
  } = useHistoryWeather({
    stationId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    limit,
    interval,
  });

  const chartData = useMemo(() => {
    if (!historyData?.data) return [];

    return historyData.data.map((item) => ({
      time: formatTime(item.dateObserved, timeRange),
      fullTime: item.dateObserved,
      temperature: item.temperature.current ?? 0,
      feelsLike: item.temperature.feelsLike ?? 0,
      tempMin: item.temperature.min ?? null,
      tempMax: item.temperature.max ?? null,
      humidity: (item.atmospheric.humidity ?? 0) * 100,
      pressure: item.atmospheric.pressure ?? 0,
      windSpeed: item.wind.speed ?? 0,
      windGust: item.wind.gust ?? 0,
      precipitation: item.precipitation ?? 0,
      cloudiness: item.cloudiness ?? 0,
      visibility: item.visibility ? item.visibility / 1000 : 0, // Convert m to km
    }));
  }, [historyData, timeRange]);

  console.log('🚀 -------------------------------------------------------------------🚀');
  console.log('🚀 -> HistoryChart.tsx:182 -> HistoryChart -> chartData:', chartData);
  console.log('🚀 -------------------------------------------------------------------🚀');

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
                    <linearGradient id="tempRangeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} unit="°C" />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(value: number, name: string) => {
                      const labels: Record<string, string> = {
                        temperature: 'Nhiệt độ',
                        feelsLike: 'Cảm giác như',
                        tempMin: 'Thấp nhất',
                        tempMax: 'Cao nhất',
                      };
                      return [`${value.toFixed(1)}°C`, labels[name] || name];
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="tempMax"
                    stroke="#ef4444"
                    strokeWidth={1}
                    fill="url(#tempRangeGradient)"
                    name="tempMax"
                    dot={false}
                    connectNulls
                  />
                  <Area
                    type="monotone"
                    dataKey="tempMin"
                    stroke="#3b82f6"
                    strokeWidth={1}
                    fill="#fff"
                    name="tempMin"
                    dot={false}
                    connectNulls
                  />
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
                    stroke="#a855f7"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="feelsLike"
                    dot={false}
                    connectNulls
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
                    {...tooltipStyle}
                    formatter={(value: number, name: string) => {
                      const labels: Record<string, string> = {
                        humidity: 'Độ ẩm',
                        cloudiness: 'Mây',
                      };
                      return [`${value.toFixed(0)}%`, labels[name] || name];
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    name="humidity"
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cloudiness"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    name="cloudiness"
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
                    {...tooltipStyle}
                    formatter={(value: number, name: string) => {
                      const labels: Record<string, string> = {
                        windSpeed: 'Tốc độ gió',
                        windGust: 'Gió giật',
                      };
                      return [`${value.toFixed(1)} m/s`, labels[name] || name];
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
                    {...tooltipStyle}
                    formatter={(value: number) => [`${value.toFixed(1)} mm`, 'Lượng mưa']}
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
          <div className="mt-4 text-sm text-slate-500 text-center space-y-1">
            <div>{getIntervalDescription(timeRange)}</div>
            <div>
              Hiển thị {historyData.data.length} / {historyData.meta.total} điểm dữ liệu
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
