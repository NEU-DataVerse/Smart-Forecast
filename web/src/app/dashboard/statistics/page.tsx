'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { StatisticReportDialog } from '@/components/StatisticReportDialog';
import { PrintableStatisticReport } from '@/components/PrintableStatisticReport';
import { Printer, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';

const temperatureData = [
  { time: '00:00', temp: 18, avgTemp: 20 },
  { time: '03:00', temp: 16, avgTemp: 18 },
  { time: '06:00', temp: 15, avgTemp: 17 },
  { time: '09:00', temp: 20, avgTemp: 22 },
  { time: '12:00', temp: 26, avgTemp: 27 },
  { time: '15:00', temp: 28, avgTemp: 28 },
  { time: '18:00', temp: 24, avgTemp: 25 },
  { time: '21:00', temp: 20, avgTemp: 22 },
];

const rainfallData = [
  { day: 'Mon', rainfall: 5 },
  { day: 'Tue', rainfall: 12 },
  { day: 'Wed', rainfall: 8 },
  { day: 'Thu', rainfall: 0 },
  { day: 'Fri', rainfall: 15 },
  { day: 'Sat', rainfall: 20 },
  { day: 'Sun', rainfall: 3 },
];

const humidityData = [
  { date: 'Week 1', humidity: 65, avgHumidity: 62 },
  { date: 'Week 2', humidity: 70, avgHumidity: 68 },
  { date: 'Week 3', humidity: 58, avgHumidity: 60 },
  { date: 'Week 4', humidity: 75, avgHumidity: 72 },
];

interface StatisticReportConfig {
  title: string;
  dateRange: string;
  includeTemperature: boolean;
  includeRainfall: boolean;
  includeHumidity: boolean;
  includeWindSpeed: boolean;
  includeAirQuality: boolean;
  region: string;
}

export default function Statistics() {
  const [timeFilter, setTimeFilter] = useState('week');
  const [reportConfig, setReportConfig] = useState<StatisticReportConfig | null>(null);
  const [showReportPreview, setShowReportPreview] = useState(false);

  const handleCreateReport = (config: StatisticReportConfig) => {
    setReportConfig(config);
    setShowReportPreview(true);
    toast.success('Report created successfully!');
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleClosePreview = () => {
    setShowReportPreview(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900">Statistics & Analytics</h2>
          <p className="text-slate-500 text-sm">Weather trends and comparative analysis</p>
        </div>
        <div className="flex gap-2">
          <StatisticReportDialog onCreateReport={handleCreateReport} />
          <Button
            variant={timeFilter === 'day' ? 'default' : 'outline'}
            onClick={() => setTimeFilter('day')}
            size="sm"
          >
            Day
          </Button>
          <Button
            variant={timeFilter === 'week' ? 'default' : 'outline'}
            onClick={() => setTimeFilter('week')}
            size="sm"
          >
            Week
          </Button>
          <Button
            variant={timeFilter === 'month' ? 'default' : 'outline'}
            onClick={() => setTimeFilter('month')}
            size="sm"
          >
            Month
          </Button>
        </div>
      </div>

      {/* Report Preview Dialog */}
      <Dialog open={showReportPreview} onOpenChange={setShowReportPreview}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
          <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between print:hidden z-10">
            <h3 className="text-slate-900">Report Preview</h3>
            <div className="flex gap-2">
              <Button onClick={handlePrintReport} size="sm">
                <Printer className="h-4 w-4 mr-1.5" />
                Print / Save as PDF
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClosePreview}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-4">
            {reportConfig && <PrintableStatisticReport config={reportConfig} />}
          </div>
        </DialogContent>
      </Dialog>

      {/* Temperature Trends */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Temperature Trends</CardTitle>
          <CardDescription className="text-xs">
            Current vs. average temperature comparison over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Current Temp (°C)"
                dot={{ fill: '#3b82f6', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="avgTemp"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Avg Temp (°C)"
                dot={{ fill: '#94a3b8', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Rainfall Statistics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Rainfall Analysis</CardTitle>
            <CardDescription className="text-xs">Weekly precipitation levels (mm)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={rainfallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="rainfall" fill="#06b6d4" radius={[8, 8, 0, 0]} name="Rainfall (mm)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Humidity Statistics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Humidity Levels</CardTitle>
            <CardDescription className="text-xs">Monthly humidity trends (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={humidityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="humidity"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                  name="Humidity (%)"
                />
                <Area
                  type="monotone"
                  dataKey="avgHumidity"
                  stroke="#c4b5fd"
                  fill="#c4b5fd"
                  fillOpacity={0.4}
                  name="Avg Humidity (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-slate-500 text-xs mb-1">Highest Temperature</p>
              <p className="text-slate-900 text-xl">28°C</p>
              <p className="text-slate-400 text-xs">at 3:00 PM</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-slate-500 text-xs mb-1">Total Rainfall</p>
              <p className="text-slate-900 text-xl">63 mm</p>
              <p className="text-slate-400 text-xs">this week</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-slate-500 text-xs mb-1">Average Humidity</p>
              <p className="text-slate-900 text-xl">67%</p>
              <p className="text-slate-400 text-xs">this month</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
