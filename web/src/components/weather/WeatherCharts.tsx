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
    time: string;
    temperature: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    rainfall: number;
    clouds: number;
    visibility?: number;
    uv?: number;
    precipitation?: number;
  }>;
}

export function WeatherCharts({ data }: WeatherChartsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dự báo thời tiết</CardTitle>
        <CardDescription>Dự báo thời tiết 7 ngày với các chỉ số chi tiết</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="temperature" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="temperature">Nhiệt độ</TabsTrigger>
            <TabsTrigger value="humidity">Độ ẩm</TabsTrigger>
            <TabsTrigger value="wind">Gió</TabsTrigger>
            <TabsTrigger value="pressure">Áp suất</TabsTrigger>
            <TabsTrigger value="precipitation">Lượng mưa</TabsTrigger>
            <TabsTrigger value="clouds">Mây</TabsTrigger>
            <TabsTrigger value="uv">Chỉ số UV</TabsTrigger>
            <TabsTrigger value="visibility">Tầm nhìn</TabsTrigger>
          </TabsList>

          <TabsContent value="temperature">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" unit="°C" />
                <Tooltip formatter={(value: number) => [`${value}°C`, 'Nhiệt độ']} />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorTemp)"
                  name="Nhiệt độ (°C)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="humidity">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" unit="%" domain={[0, 100]} />
                <Tooltip formatter={(value: number) => [`${value}%`, 'Độ ẩm']} />
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
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" unit=" m/s" />
                <Tooltip />
                <Legend />
                <Bar dataKey="windSpeed" fill="#8b5cf6" name="Tốc độ gió (m/s)" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="pressure">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" unit=" hPa" domain={['auto', 'auto']} />
                <Tooltip formatter={(value: number) => [`${value} hPa`, 'Áp suất']} />
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
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" unit=" mm" />
                <Tooltip formatter={(value: number) => [`${value} mm`, 'Lượng mưa']} />
                <Legend />
                <Bar
                  dataKey="rainfall"
                  fill="#3b82f6"
                  name="Lượng mưa (mm)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="precipitation"
                  fill="#0ea5e9"
                  name="Tổng lượng mưa (mm)"
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
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" unit="%" domain={[0, 100]} />
                <Tooltip formatter={(value: number) => [`${value}%`, 'Độ che phủ mây']} />
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

          <TabsContent value="uv">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[0, 11]} />
                <Tooltip
                  formatter={(value: number) => {
                    const level =
                      value <= 2
                        ? 'Thấp'
                        : value <= 5
                          ? 'Trung bình'
                          : value <= 7
                            ? 'Cao'
                            : value <= 10
                              ? 'Rất cao'
                              : 'Cực kỳ cao';
                    return [`${value} (${level})`, 'Chỉ số UV'];
                  }}
                />
                <Bar dataKey="uv" name="Chỉ số UV" radius={[4, 4, 0, 0]} fill="#eab308" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="visibility">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" unit=" km" />
                <Tooltip formatter={(value: number) => [`${value} km`, 'Tầm nhìn']} />
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
        </Tabs>
      </CardContent>
    </Card>
  );
}
