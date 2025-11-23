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
import { Cloud, Droplets, Wind } from 'lucide-react';

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

interface PrintableStatisticReportProps {
  config: StatisticReportConfig;
}

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

const windSpeedData = [
  { time: '00:00', speed: 12 },
  { time: '04:00', speed: 8 },
  { time: '08:00', speed: 15 },
  { time: '12:00', speed: 22 },
  { time: '16:00', speed: 18 },
  { time: '20:00', speed: 10 },
];

const aqiData = [
  { date: 'Day 1', aqi: 42 },
  { date: 'Day 2', aqi: 38 },
  { date: 'Day 3', aqi: 55 },
  { date: 'Day 4', aqi: 45 },
  { date: 'Day 5', aqi: 50 },
  { date: 'Day 6', aqi: 40 },
  { date: 'Day 7', aqi: 48 },
];

const regionNames: Record<string, string> = {
  all: 'All Regions',
  downtown: 'Downtown District',
  north: 'North Region',
  east: 'East Harbor',
  west: 'West Valley',
  south: 'South Area',
};

const dateRangeNames: Record<string, string> = {
  day: 'Last 24 Hours',
  week: 'Last 7 Days',
  month: 'Last 30 Days',
  quarter: 'Last 3 Months',
  year: 'Last Year',
};

export function PrintableStatisticReport({ config }: PrintableStatisticReportProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white p-8 max-w-5xl mx-auto print:p-4">
      {/* Header */}
      <div className="mb-6 pb-4 border-b-2 border-slate-300">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">⛈️</span>
            </div>
            <div>
              <h1 className="text-slate-900 text-2xl">{config.title}</h1>
              <p className="text-slate-500 text-sm">Smart Weather Forecasting System</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-900 text-sm">Generated: {currentDate}</p>
            <p className="text-slate-500 text-xs">
              Report ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <span className="text-slate-500">Date Range: </span>
            <span className="text-slate-900">{dateRangeNames[config.dateRange]}</span>
          </div>
          <div>
            <span className="text-slate-500">Region: </span>
            <span className="text-slate-900">{regionNames[config.region]}</span>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mb-6">
        <h2 className="text-slate-900 text-lg mb-3">Summary Statistics</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-slate-200 rounded-lg p-4 text-center">
            <Cloud className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-slate-500 text-xs mb-1">Avg Temperature</p>
            <p className="text-slate-900 text-xl">22°C</p>
          </div>
          <div className="border border-slate-200 rounded-lg p-4 text-center">
            <Droplets className="h-6 w-6 text-cyan-500 mx-auto mb-2" />
            <p className="text-slate-500 text-xs mb-1">Total Rainfall</p>
            <p className="text-slate-900 text-xl">63 mm</p>
          </div>
          <div className="border border-slate-200 rounded-lg p-4 text-center">
            <Wind className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-slate-500 text-xs mb-1">Avg Humidity</p>
            <p className="text-slate-900 text-xl">67%</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {config.includeTemperature && (
          <div className="border border-slate-200 rounded-lg p-4 print:break-inside-avoid">
            <h3 className="text-slate-900 mb-2">Temperature Trends</h3>
            <p className="text-slate-500 text-xs mb-4">
              Current vs. average temperature comparison
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Current Temp (°C)"
                  dot={{ fill: '#3b82f6', r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="avgTemp"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Avg Temp (°C)"
                  dot={{ fill: '#94a3b8', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {config.includeRainfall && (
          <div className="border border-slate-200 rounded-lg p-4 print:break-inside-avoid">
            <h3 className="text-slate-900 mb-2">Rainfall Analysis</h3>
            <p className="text-slate-500 text-xs mb-4">Weekly precipitation levels (mm)</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={rainfallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="rainfall" fill="#06b6d4" radius={[8, 8, 0, 0]} name="Rainfall (mm)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {config.includeHumidity && (
          <div className="border border-slate-200 rounded-lg p-4 print:break-inside-avoid">
            <h3 className="text-slate-900 mb-2">Humidity Levels</h3>
            <p className="text-slate-500 text-xs mb-4">Monthly humidity trends (%)</p>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={humidityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
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
          </div>
        )}

        {config.includeWindSpeed && (
          <div className="border border-slate-200 rounded-lg p-4 print:break-inside-avoid">
            <h3 className="text-slate-900 mb-2">Wind Speed</h3>
            <p className="text-slate-500 text-xs mb-4">Hourly wind speed measurements (km/h)</p>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={windSpeedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="speed"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Wind Speed (km/h)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {config.includeAirQuality && (
          <div className="border border-slate-200 rounded-lg p-4 print:break-inside-avoid">
            <h3 className="text-slate-900 mb-2">Air Quality Index</h3>
            <p className="text-slate-500 text-xs mb-4">Daily AQI measurements</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={aqiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="aqi" fill="#f59e0b" radius={[8, 8, 0, 0]} name="AQI" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-xs">
          This report was automatically generated by Smart Weather Forecasting System
        </p>
        <p className="text-slate-400 text-xs">
          © {new Date().getFullYear()} Smart Weather Forecasting System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
