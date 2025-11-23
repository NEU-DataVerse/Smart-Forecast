'use client';
import { useState } from 'react';
import {
  Search,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Cloud,
  Gauge,
  Sunrise,
  Sunset,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
} from 'recharts';

// Mock hourly data for 24 hours
const generateHourlyData = () => {
  const hours = [];
  const baseTemp = 20;
  const baseHumidity = 65;
  const basePressure = 1013;
  const baseWindSpeed = 10;

  for (let i = 0; i < 24; i++) {
    const hour = i;
    const timeLabel = `${hour.toString().padStart(2, '0')}:00`;

    // Simulate temperature variation (cooler at night, warmer during day)
    const tempVariation = Math.sin(((i - 6) * Math.PI) / 12) * 6;
    const temp = baseTemp + tempVariation + (Math.random() - 0.5) * 2;

    // Simulate humidity (inverse of temperature)
    const humidity = baseHumidity - tempVariation * 1.5 + (Math.random() - 0.5) * 5;

    // Simulate pressure
    const pressure = basePressure + Math.sin((i * Math.PI) / 12) * 3 + (Math.random() - 0.5);

    // Simulate wind speed
    const windSpeed = baseWindSpeed + Math.sin((i * Math.PI) / 8) * 5 + (Math.random() - 0.5) * 3;

    // Simulate precipitation (random chance)
    const precipitation = Math.random() > 0.7 ? Math.random() * 5 : 0;

    // Simulate cloud coverage
    const cloudCoverage = 30 + Math.sin((i * Math.PI) / 10) * 30 + (Math.random() - 0.5) * 20;

    // Simulate UV index (higher during midday)
    const uvIndex = i >= 6 && i <= 18 ? Math.max(0, 5 + Math.sin(((i - 12) * Math.PI) / 6) * 5) : 0;

    // Simulate visibility
    const visibility = 10 - (cloudCoverage / 100) * 3 + (Math.random() - 0.5);

    hours.push({
      hour: timeLabel,
      temperature: parseFloat(temp.toFixed(1)),
      humidity: parseFloat(humidity.toFixed(1)),
      pressure: parseFloat(pressure.toFixed(1)),
      windSpeed: parseFloat(windSpeed.toFixed(1)),
      precipitation: parseFloat(precipitation.toFixed(1)),
      cloudCoverage: parseFloat(cloudCoverage.toFixed(1)),
      uvIndex: parseFloat(uvIndex.toFixed(1)),
      visibility: parseFloat(visibility.toFixed(1)),
    });
  }

  return hours;
};

export default function WeatherDetails() {
  const [searchType, setSearchType] = useState('address');
  const [searchQuery, setSearchQuery] = useState('');
  const [hourlyData] = useState(generateHourlyData());
  const [weatherData, setWeatherData] = useState({
    location: 'San Francisco, CA',
    coordinates: '37.7749°N, 122.4194°W',
    current: 24,
    min: 18,
    max: 28,
    humidity: 65,
    windSpeed: 12,
    windDirection: 'NE',
    pressure: 1013,
    cloudCoverage: 45,
    visibility: 10,
    sunrise: '06:42 AM',
    sunset: '07:18 PM',
    condition: 'Partly Cloudy',
  });

  const handleSearch = () => {
    // Mock search - in real app would call weather API
    console.log('Searching for:', searchQuery);
  };

  const weatherMetrics = [
    {
      icon: Thermometer,
      label: 'Temperature',
      value: `${weatherData.current}°C`,
      subValue: `Min: ${weatherData.min}°C / Max: ${weatherData.max}°C`,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${weatherData.humidity}%`,
      subValue: 'Comfortable level',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Wind,
      label: 'Wind',
      value: `${weatherData.windSpeed} km/h`,
      subValue: `Direction: ${weatherData.windDirection}`,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50',
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: `${weatherData.pressure} hPa`,
      subValue: 'Standard pressure',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Cloud,
      label: 'Cloud Coverage',
      value: `${weatherData.cloudCoverage}%`,
      subValue: weatherData.condition,
      color: 'text-slate-500',
      bgColor: 'bg-slate-50',
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: `${weatherData.visibility} km`,
      subValue: 'Good visibility',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
  ];

  type TooltipPayloadEntry = {
    name?: string;
    value?: number | string;
    unit?: string;
    color?: string;
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: TooltipPayloadEntry[];
    label?: string | number;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg">
          <p className="text-slate-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.unit || ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-900">Weather Details</h2>
        <p className="text-slate-500">Search and view detailed weather information</p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search Location</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={searchType} onValueChange={setSearchType}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="address">By Address</TabsTrigger>
              <TabsTrigger value="coordinates">By Coordinates</TabsTrigger>
            </TabsList>

            <TabsContent value="address" className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Enter Address or City Name</Label>
                  <Input
                    placeholder="e.g., San Francisco, CA"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="coordinates" className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Latitude</Label>
                  <Input placeholder="e.g., 37.7749" />
                </div>
                <div className="flex-1">
                  <Label>Longitude</Label>
                  <Input placeholder="e.g., -122.4194" />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weatherMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`${metric.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-500">{metric.label}</p>
                    <p className="text-slate-900">{metric.value}</p>
                    <p className="text-slate-400">{metric.subValue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sun Times */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <Sunrise className="h-8 w-8 text-orange-500" />
              </div>
              <div>
                <p className="text-slate-500">Sunrise</p>
                <p className="text-slate-900">{weatherData.sunrise}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <Sunset className="h-8 w-8 text-indigo-500" />
              </div>
              <div>
                <p className="text-slate-500">Sunset</p>
                <p className="text-slate-900">{weatherData.sunset}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Forecast Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <CardTitle>24-Hour Forecast Details</CardTitle>
          </div>
          <CardDescription>Detailed hourly trends for all weather indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="temperature" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
              <TabsTrigger value="humidity">Humidity</TabsTrigger>
              <TabsTrigger value="wind">Wind Speed</TabsTrigger>
              <TabsTrigger value="pressure">Pressure</TabsTrigger>
              <TabsTrigger value="precipitation">Precipitation</TabsTrigger>
              <TabsTrigger value="clouds">Clouds</TabsTrigger>
              <TabsTrigger value="uv">UV Index</TabsTrigger>
              <TabsTrigger value="visibility">Visibility</TabsTrigger>
            </TabsList>

            {/* Temperature Chart */}
            <TabsContent value="temperature" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-slate-600">Current</p>
                  <p className="text-slate-900">
                    {hourlyData[new Date().getHours()]?.temperature}°C
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-slate-600">Min Today</p>
                  <p className="text-slate-900">
                    {Math.min(...hourlyData.map((d) => d.temperature)).toFixed(1)}°C
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-slate-600">Max Today</p>
                  <p className="text-slate-900">
                    {Math.max(...hourlyData.map((d) => d.temperature)).toFixed(1)}°C
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-slate-600">Avg Today</p>
                  <p className="text-slate-900">
                    {(hourlyData.reduce((sum, d) => sum + d.temperature, 0) / 24).toFixed(1)}°C
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" stroke="#64748b" />
                  <YAxis
                    stroke="#64748b"
                    label={{ value: '°C', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#colorTemp)"
                    name="Temperature"
                    unit="°C"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            {/* Humidity Chart */}
            <TabsContent value="humidity" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-slate-600">Current</p>
                  <p className="text-slate-900">
                    {hourlyData[new Date().getHours()]?.humidity.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <p className="text-slate-600">Min Today</p>
                  <p className="text-slate-900">
                    {Math.min(...hourlyData.map((d) => d.humidity)).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-slate-600">Max Today</p>
                  <p className="text-slate-900">
                    {Math.max(...hourlyData.map((d) => d.humidity)).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-slate-600">Avg Today</p>
                  <p className="text-slate-900">
                    {(hourlyData.reduce((sum, d) => sum + d.humidity, 0) / 24).toFixed(1)}%
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" stroke="#64748b" />
                  <YAxis
                    stroke="#64748b"
                    label={{ value: '%', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Humidity"
                    unit="%"
                    dot={{ fill: '#3b82f6', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            {/* Wind Speed Chart */}
            <TabsContent value="wind" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <p className="text-slate-600">Current</p>
                  <p className="text-slate-900">
                    {hourlyData[new Date().getHours()]?.windSpeed.toFixed(1)} km/h
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-slate-600">Min Today</p>
                  <p className="text-slate-900">
                    {Math.min(...hourlyData.map((d) => d.windSpeed)).toFixed(1)} km/h
                  </p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-slate-600">Max Gust</p>
                  <p className="text-slate-900">
                    {Math.max(...hourlyData.map((d) => d.windSpeed)).toFixed(1)} km/h
                  </p>
                </div>
                <div className="bg-sky-50 p-4 rounded-lg">
                  <p className="text-slate-600">Avg Today</p>
                  <p className="text-slate-900">
                    {(hourlyData.reduce((sum, d) => sum + d.windSpeed, 0) / 24).toFixed(1)} km/h
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" stroke="#64748b" />
                  <YAxis
                    stroke="#64748b"
                    label={{ value: 'km/h', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="windSpeed"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fill="url(#colorWind)"
                    name="Wind Speed"
                    unit=" km/h"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            {/* Atmospheric Pressure Chart */}
            <TabsContent value="pressure" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-slate-600">Current</p>
                  <p className="text-slate-900">
                    {hourlyData[new Date().getHours()]?.pressure.toFixed(1)} hPa
                  </p>
                </div>
                <div className="bg-violet-50 p-4 rounded-lg">
                  <p className="text-slate-600">Min Today</p>
                  <p className="text-slate-900">
                    {Math.min(...hourlyData.map((d) => d.pressure)).toFixed(1)} hPa
                  </p>
                </div>
                <div className="bg-fuchsia-50 p-4 rounded-lg">
                  <p className="text-slate-600">Max Today</p>
                  <p className="text-slate-900">
                    {Math.max(...hourlyData.map((d) => d.pressure)).toFixed(1)} hPa
                  </p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <p className="text-slate-600">Trend</p>
                  <p className="text-slate-900">Stable</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" stroke="#64748b" />
                  <YAxis
                    stroke="#64748b"
                    domain={['dataMin - 5', 'dataMax + 5']}
                    label={{ value: 'hPa', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="pressure"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Pressure"
                    unit=" hPa"
                    dot={{ fill: '#8b5cf6', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            {/* Precipitation Chart */}
            <TabsContent value="precipitation" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-slate-600">Total Today</p>
                  <p className="text-slate-900">
                    {hourlyData.reduce((sum, d) => sum + d.precipitation, 0).toFixed(1)} mm
                  </p>
                </div>
                <div className="bg-sky-50 p-4 rounded-lg">
                  <p className="text-slate-600">Peak Hour</p>
                  <p className="text-slate-900">
                    {Math.max(...hourlyData.map((d) => d.precipitation)).toFixed(1)} mm
                  </p>
                </div>
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <p className="text-slate-600">Rainy Hours</p>
                  <p className="text-slate-900">
                    {hourlyData.filter((d) => d.precipitation > 0).length}
                  </p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-slate-600">Probability</p>
                  <p className="text-slate-900">
                    {((hourlyData.filter((d) => d.precipitation > 0).length / 24) * 100).toFixed(0)}
                    %
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" stroke="#64748b" />
                  <YAxis
                    stroke="#64748b"
                    label={{ value: 'mm', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="precipitation"
                    fill="#0ea5e9"
                    radius={[8, 8, 0, 0]}
                    name="Precipitation"
                    unit=" mm"
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            {/* Cloud Coverage Chart */}
            <TabsContent value="clouds" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-600">Current</p>
                  <p className="text-slate-900">
                    {hourlyData[new Date().getHours()]?.cloudCoverage.toFixed(0)}%
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-slate-600">Min Today</p>
                  <p className="text-slate-900">
                    {Math.min(...hourlyData.map((d) => d.cloudCoverage)).toFixed(0)}%
                  </p>
                </div>
                <div className="bg-zinc-50 p-4 rounded-lg">
                  <p className="text-slate-600">Max Today</p>
                  <p className="text-slate-900">
                    {Math.max(...hourlyData.map((d) => d.cloudCoverage)).toFixed(0)}%
                  </p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <p className="text-slate-600">Avg Today</p>
                  <p className="text-slate-900">
                    {(hourlyData.reduce((sum, d) => sum + d.cloudCoverage, 0) / 24).toFixed(0)}%
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="colorCloud" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" stroke="#64748b" />
                  <YAxis
                    stroke="#64748b"
                    label={{ value: '%', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="cloudCoverage"
                    stroke="#64748b"
                    strokeWidth={2}
                    fill="url(#colorCloud)"
                    name="Cloud Coverage"
                    unit="%"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            {/* UV Index Chart */}
            <TabsContent value="uv" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-slate-600">Current</p>
                  <p className="text-slate-900">
                    {hourlyData[new Date().getHours()]?.uvIndex.toFixed(1)}
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-slate-600">Peak Today</p>
                  <p className="text-slate-900">
                    {Math.max(...hourlyData.map((d) => d.uvIndex)).toFixed(1)}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-slate-600">Peak Time</p>
                  <p className="text-slate-900">
                    {
                      hourlyData.find(
                        (d) => d.uvIndex === Math.max(...hourlyData.map((h) => h.uvIndex)),
                      )?.hour
                    }
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-slate-600">Risk Level</p>
                  <p className="text-slate-900">
                    {Math.max(...hourlyData.map((d) => d.uvIndex)) < 3
                      ? 'Low'
                      : Math.max(...hourlyData.map((d) => d.uvIndex)) < 6
                        ? 'Moderate'
                        : Math.max(...hourlyData.map((d) => d.uvIndex)) < 8
                          ? 'High'
                          : 'Very High'}
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="colorUV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" stroke="#64748b" />
                  <YAxis
                    stroke="#64748b"
                    label={{ value: 'UV Index', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="uvIndex"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fill="url(#colorUV)"
                    name="UV Index"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            {/* Visibility Chart */}
            <TabsContent value="visibility" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-slate-600">Current</p>
                  <p className="text-slate-900">
                    {hourlyData[new Date().getHours()]?.visibility.toFixed(1)} km
                  </p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <p className="text-slate-600">Min Today</p>
                  <p className="text-slate-900">
                    {Math.min(...hourlyData.map((d) => d.visibility)).toFixed(1)} km
                  </p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-slate-600">Max Today</p>
                  <p className="text-slate-900">
                    {Math.max(...hourlyData.map((d) => d.visibility)).toFixed(1)} km
                  </p>
                </div>
                <div className="bg-lime-50 p-4 rounded-lg">
                  <p className="text-slate-600">Avg Today</p>
                  <p className="text-slate-900">
                    {(hourlyData.reduce((sum, d) => sum + d.visibility, 0) / 24).toFixed(1)} km
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" stroke="#64748b" />
                  <YAxis
                    stroke="#64748b"
                    label={{ value: 'km', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="visibility"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Visibility"
                    unit=" km"
                    dot={{ fill: '#10b981', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
