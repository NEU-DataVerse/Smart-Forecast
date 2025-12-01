/**
 * History Chart Component
 * Displays historical AQI trend over time from /history endpoint
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { useHistoryAirQuality } from '@/hooks/useAirQualityQuery';
import type { AQAggregationInterval } from '@/types/dto';

interface HistoryChartProps {
  stationId?: string;
}

type TimeRange = '24h' | '7d' | '30d';

// Common tooltip style
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
 * EPA AQI Breakpoints for reference lines
 * Good: 0-50 (Green)
 * Moderate: 51-100 (Yellow)
 * Unhealthy for Sensitive: 101-150 (Orange)
 * Unhealthy: 151-200 (Red)
 * Very Unhealthy: 201-300 (Purple)
 * Hazardous: 301+ (Maroon)
 */
const AQI_LEVELS = [
  { value: 50, label: 'Tốt', color: '#22c55e' },
  { value: 100, label: 'Trung bình', color: '#eab308' },
  { value: 150, label: 'Không tốt cho nhóm nhạy cảm', color: '#f97316' },
  { value: 200, label: 'Không lành mạnh', color: '#ef4444' },
  { value: 300, label: 'Rất không lành mạnh', color: '#a855f7' },
];

/**
 * Get the appropriate aggregation interval based on time range
 * - 24h: hourly data (~24 points)
 * - 7d: 6-hour intervals (~28 points)
 * - 30d: daily data (~30 points)
 */
function getIntervalForRange(range: TimeRange): AQAggregationInterval {
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
  } = useHistoryAirQuality({
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
              <TabsTrigger value="aqi">Xu hướng AQI</TabsTrigger>
              <TabsTrigger value="pm">PM2.5 & PM10</TabsTrigger>
              <TabsTrigger value="gases">Khí độc</TabsTrigger>
            </TabsList>

            <TabsContent value="aqi">
              {/* AQI Legend */}
              <div className="flex flex-wrap gap-3 mb-3 text-xs">
                {AQI_LEVELS.map((level) => (
                  <div key={level.value} className="flex items-center gap-1">
                    <span
                      className="w-3 h-0.5 inline-block"
                      style={{ backgroundColor: level.color }}
                    />
                    <span className="text-slate-600">
                      {level.value}: {level.label}
                    </span>
                  </div>
                ))}
              </div>
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
                  <YAxis stroke="#64748b" fontSize={12} domain={[0, 'auto']} />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(value: number) => [`${value}`, 'AQI (EPA US)']}
                  />
                  {/* AQI Reference Lines */}
                  {AQI_LEVELS.filter(
                    (level) => level.value <= Math.max(...chartData.map((d) => d.aqi), 0) + 50,
                  ).map((level) => (
                    <ReferenceLine
                      key={level.value}
                      y={level.value}
                      stroke={level.color}
                      strokeDasharray="5 5"
                      strokeWidth={1.5}
                    />
                  ))}
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
                  <YAxis stroke="#64748b" fontSize={12} unit=" μg/m³" />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(value: number, name: string) => {
                      const labels: Record<string, string> = {
                        pm25: 'PM2.5',
                        pm10: 'PM10',
                      };
                      return [`${value.toFixed(1)} μg/m³`, labels[name] || name];
                    }}
                  />
                  <Legend
                    formatter={(value: string) => {
                      const labels: Record<string, string> = {
                        pm25: 'PM2.5',
                        pm10: 'PM10',
                      };
                      return labels[value] || value;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pm25"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="pm25"
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pm10"
                    stroke="#f97316"
                    strokeWidth={2}
                    name="pm10"
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
                  <YAxis stroke="#64748b" fontSize={12} unit=" μg/m³" />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(value: number, name: string) => {
                      const labels: Record<string, string> = {
                        co: 'CO',
                        no2: 'NO₂',
                        so2: 'SO₂',
                        o3: 'O₃',
                      };
                      return [`${value.toFixed(1)} μg/m³`, labels[name] || name];
                    }}
                  />
                  <Legend
                    formatter={(value: string) => {
                      const labels: Record<string, string> = {
                        co: 'CO',
                        no2: 'NO₂',
                        so2: 'SO₂',
                        o3: 'O₃',
                      };
                      return labels[value] || value;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="co"
                    stroke="#eab308"
                    strokeWidth={2}
                    name="co"
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="no2"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    name="no2"
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="so2"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="so2"
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="o3"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="o3"
                    dot={{ r: 2 }}
                  />
                </LineChart>
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
