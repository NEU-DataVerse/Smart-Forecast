import { Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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

export function ForecastCharts({ data }: ForecastChartsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          <CardTitle>24-Hour Forecast</CardTitle>
        </div>
        <CardDescription>Hourly predictions for AQI and pollutants</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="aqi" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="aqi">AQI</TabsTrigger>
            <TabsTrigger value="pm">PM2.5 & PM10</TabsTrigger>
            <TabsTrigger value="gases">Gases</TabsTrigger>
          </TabsList>

          <TabsContent value="aqi">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="aqi"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="AQI (EPA)"
                  dot={{ fill: '#3b82f6', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="pm">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Bar dataKey="pm25" fill="#ef4444" name="PM2.5 (μg/m³)" />
                <Bar dataKey="pm10" fill="#f97316" name="PM10 (μg/m³)" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="gases">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="co" stroke="#eab308" name="CO" />
                <Line type="monotone" dataKey="no2" stroke="#06b6d4" name="NO₂" />
                <Line type="monotone" dataKey="so2" stroke="#8b5cf6" name="SO₂" />
                <Line type="monotone" dataKey="o3" stroke="#3b82f6" name="O₃" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
