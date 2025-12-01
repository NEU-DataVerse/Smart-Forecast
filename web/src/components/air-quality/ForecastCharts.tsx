import { Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
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

interface ForecastChartsProps {
  data: Array<{
    time: string;
    aqi: number;
    pm25: number;
    pm10: number;
    co: number;
    no2: number;
    so2: number;
    o3: number;
  }>;
}

// Common tooltip style matching other charts
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

export function ForecastCharts({ data }: ForecastChartsProps) {
  // Calculate max AQI to determine which reference lines to show
  const maxAqi = Math.max(...data.map((d) => d.aqi), 0);
  const visibleLevels = AQI_LEVELS.filter((level) => level.value <= maxAqi + 50);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          <CardTitle>Dự báo 24 giờ</CardTitle>
        </div>
        <CardDescription>Dự báo AQI và các chất ô nhiễm theo giờ</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="aqi" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="aqi">AQI</TabsTrigger>
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
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="forecastAqiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                  fontSize={12}
                  allowDuplicatedCategory={false}
                />
                <YAxis stroke="#64748b" fontSize={12} domain={[0, 'auto']} />
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value: number) => [`${value}`, 'AQI (EPA US)']}
                />
                {/* AQI Reference Lines */}
                {visibleLevels.map((level) => (
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
                  fill="url(#forecastAqiGradient)"
                  name="AQI (EPA US)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="pm">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                  fontSize={12}
                  allowDuplicatedCategory={false}
                />
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
                <Bar dataKey="pm25" fill="#ef4444" name="pm25" />
                <Bar dataKey="pm10" fill="#f97316" name="pm10" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="gases">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                  fontSize={12}
                  allowDuplicatedCategory={false}
                />
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
      </CardContent>
    </Card>
  );
}
