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
  }>;
}

export function WeatherCharts({ data }: WeatherChartsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Forecast</CardTitle>
        <CardDescription>24-hour weather predictions</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="temperature" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="humidity">Humidity</TabsTrigger>
            <TabsTrigger value="wind">Wind & Rain</TabsTrigger>
            <TabsTrigger value="pressure">Pressure</TabsTrigger>
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
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorTemp)"
                  name="Temperature (°C)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="humidity">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  name="Humidity (%)"
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
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Bar dataKey="windSpeed" fill="#8b5cf6" name="Wind Speed (m/s)" />
                <Bar dataKey="rainfall" fill="#3b82f6" name="Rainfall (mm)" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="pressure">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Pressure (hPa)"
                  dot={{ fill: '#10b981', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
