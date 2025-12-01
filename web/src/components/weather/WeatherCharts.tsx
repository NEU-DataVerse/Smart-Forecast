import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

interface WeatherChartsProps {
  data: Array<{
    id?: number;
    time: string;
    temperature: number;
    tempMin?: number;
    tempMax?: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    rainfall: number;
    clouds: number;
    visibility?: number;
  }>;
}

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

export function WeatherCharts({ data }: WeatherChartsProps) {
  // Check if visibility data is available (OpenWeatherMap Daily Forecast API doesn't provide visibility)
  const hasVisibilityData = data.some((item) => item.visibility && item.visibility > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dự báo thời tiết</CardTitle>
        <CardDescription>Dự báo thời tiết 7 ngày với các chỉ số chi tiết</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="temperature" className="space-y-4">
          <TabsList
            className={`grid w-full ${hasVisibilityData ? 'grid-cols-4 lg:grid-cols-7' : 'grid-cols-3 lg:grid-cols-6'}`}
          >
            <TabsTrigger value="temperature">Nhiệt độ</TabsTrigger>
            <TabsTrigger value="humidity">Độ ẩm</TabsTrigger>
            <TabsTrigger value="wind">Gió</TabsTrigger>
            <TabsTrigger value="pressure">Áp suất</TabsTrigger>
            <TabsTrigger value="precipitation">Lượng mưa</TabsTrigger>
            <TabsTrigger value="clouds">Mây</TabsTrigger>
            {hasVisibilityData && <TabsTrigger value="visibility">Tầm nhìn</TabsTrigger>}
          </TabsList>

          <TabsContent value="temperature">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="tempGradientForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="tempRangeGradientForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                  fontSize={12}
                  allowDuplicatedCategory={false}
                />
                <YAxis stroke="#64748b" fontSize={12} unit="°C" />
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value: number, name: string) => {
                    const labels: Record<string, string> = {
                      temperature: 'Nhiệt độ TB',
                      tempMin: 'Thấp nhất',
                      tempMax: 'Cao nhất',
                    };
                    return [`${value.toFixed(1)}°C`, labels[name] || name];
                  }}
                />
                <Legend
                  formatter={(value: string) => {
                    const labels: Record<string, string> = {
                      temperature: 'Nhiệt độ TB',
                      tempMin: 'Thấp nhất',
                      tempMax: 'Cao nhất',
                    };
                    return labels[value] || value;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tempMax"
                  stroke="#ef4444"
                  strokeWidth={1}
                  fill="url(#tempRangeGradientForecast)"
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
                  fill="url(#tempGradientForecast)"
                  name="temperature"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="humidity">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" allowDuplicatedCategory={false} />
                <YAxis stroke="#64748b" unit="%" domain={[0, 100]} />
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value: number) => [`${value.toFixed(0)}%`, 'Độ ẩm']}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  name="Độ ẩm (%)"
                  dot={{ fill: '#06b6d4', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="wind">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" allowDuplicatedCategory={false} />
                <YAxis stroke="#64748b" unit=" m/s" />
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value: number) => [`${value.toFixed(1)} m/s`, 'Tốc độ gió']}
                />
                <Bar dataKey="windSpeed" fill="#8b5cf6" name="Tốc độ gió (m/s)" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="pressure">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" allowDuplicatedCategory={false} />
                <YAxis stroke="#64748b" unit=" hPa" domain={['auto', 'auto']} />
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value: number) => [`${value.toFixed(0)} hPa`, 'Áp suất']}
                />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Áp suất (hPa)"
                  dot={{ fill: '#10b981', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="precipitation">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" allowDuplicatedCategory={false} />
                <YAxis stroke="#64748b" unit=" mm" />
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value: number) => [`${value.toFixed(1)} mm`, 'Lượng mưa']}
                />
                <Bar
                  dataKey="rainfall"
                  fill="#3b82f6"
                  name="Lượng mưa (mm)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="clouds">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorClouds" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" allowDuplicatedCategory={false} />
                <YAxis stroke="#64748b" unit="%" domain={[0, 100]} />
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value: number) => [`${value.toFixed(0)}%`, 'Độ che phủ mây']}
                />
                <Area
                  type="monotone"
                  dataKey="clouds"
                  stroke="#94a3b8"
                  fillOpacity={1}
                  fill="url(#colorClouds)"
                  name="Độ che phủ mây (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          {hasVisibilityData && (
            <TabsContent value="visibility">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" allowDuplicatedCategory={false} />
                  <YAxis stroke="#64748b" unit=" km" />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(value: number) => [`${value.toFixed(1)} km`, 'Tầm nhìn']}
                  />
                  <Line
                    type="monotone"
                    dataKey="visibility"
                    stroke="#22c55e"
                    strokeWidth={2}
                    name="Tầm nhìn (km)"
                    dot={{ fill: '#22c55e', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
