/**
 * Compare Stations Component
 * Displays weather comparison across multiple stations (admin only)
 */

import { useState, useMemo } from 'react';
import { Scale, Plus, X, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { useCompareWeather } from '@/hooks/useWeatherQuery';
import { useStations } from '@/hooks/useStations';

const COLORS = [
  '#3b82f6',
  '#ef4444',
  '#22c55e',
  '#f59e0b',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#14b8a6',
];

function getWeatherCondition(temp: number): { label: string; color: string } {
  if (temp <= 10) return { label: 'Lạnh', color: 'bg-blue-500' };
  if (temp <= 20) return { label: 'Mát', color: 'bg-cyan-500' };
  if (temp <= 30) return { label: 'Ấm', color: 'bg-yellow-500' };
  if (temp <= 35) return { label: 'Nóng', color: 'bg-orange-500' };
  return { label: 'Rất nóng', color: 'bg-red-500' };
}

export function CompareStations() {
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const { stations, loading: stationsLoading } = useStations({ autoFetch: true });

  const {
    data: compareData,
    isLoading,
    error,
    refetch,
  } = useCompareWeather({ stationCodes: selectedCodes });

  // Bar chart data for temperature comparison
  const temperatureChartData = useMemo(() => {
    if (!compareData?.stations) return [];
    return compareData.stations
      .filter((s) => s.data)
      .map((s) => ({
        name: s.stationName || s.stationId,
        temperature: s.data?.temperature.current ?? 0,
        feelsLike: s.data?.temperature.feelsLike ?? 0,
        humidity: s.data?.atmospheric.humidity ?? 0,
      }));
  }, [compareData]);

  // Radar chart data for weather metrics comparison
  const radarChartData = useMemo(() => {
    if (!compareData?.stations) return [];

    const metricNames = ['Nhiệt độ', 'Độ ẩm', 'Gió', 'Mây', 'Áp suất'];
    const metricKeys = ['temperature', 'humidity', 'wind', 'clouds', 'pressure'] as const;

    return metricNames.map((name, idx) => {
      const key = metricKeys[idx];
      const entry: Record<string, string | number> = { metric: name };

      compareData.stations.forEach((station) => {
        if (station.data) {
          let value = 0;
          switch (key) {
            case 'temperature':
              // Normalize to 0-100 scale (assume -10 to 50 range)
              value = (((station.data.temperature.current ?? 0) + 10) / 60) * 100;
              break;
            case 'humidity':
              value = station.data.atmospheric.humidity ?? 0;
              break;
            case 'wind':
              // Normalize wind speed (assume 0-30 m/s range)
              value = ((station.data.wind.speed ?? 0) / 30) * 100;
              break;
            case 'clouds':
              value = station.data.cloudiness ?? 0;
              break;
            case 'pressure':
              // Normalize pressure (assume 980-1040 hPa range)
              value = (((station.data.atmospheric.pressure ?? 1013) - 980) / 60) * 100;
              break;
          }
          entry[station.stationName || station.stationId] = Math.min(100, Math.max(0, value));
        }
      });

      return entry;
    });
  }, [compareData]);

  const addStation = (code: string) => {
    if (!selectedCodes.includes(code) && selectedCodes.length < 10) {
      setSelectedCodes([...selectedCodes, code]);
    }
  };

  const removeStation = (code: string) => {
    setSelectedCodes(selectedCodes.filter((c) => c !== code));
  };

  const availableStations = useMemo(() => {
    return stations.filter((s) => !selectedCodes.includes(s.code));
  }, [stations, selectedCodes]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-500" />
            <div>
              <CardTitle>So sánh thời tiết các trạm</CardTitle>
              <CardDescription>Chọn 2-10 trạm để so sánh dữ liệu thời tiết</CardDescription>
            </div>
          </div>
          {selectedCodes.length >= 2 && (
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Station selector */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {selectedCodes.map((code, idx) => {
              const station = stations.find((s) => s.code === code);
              return (
                <Badge
                  key={code}
                  variant="secondary"
                  className="pl-2 pr-1 py-1 flex items-center gap-1"
                  style={{ borderLeftColor: COLORS[idx % COLORS.length], borderLeftWidth: 3 }}
                >
                  {station?.name || code}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 hover:bg-slate-200"
                    onClick={() => removeStation(code)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>

          {selectedCodes.length < 10 && (
            <div className="flex items-center gap-2">
              <Select onValueChange={addStation} disabled={stationsLoading}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Thêm trạm quan trắc..." />
                </SelectTrigger>
                <SelectContent>
                  {availableStations.map((station) => (
                    <SelectItem key={station.code} value={station.code}>
                      {station.name} ({station.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Plus className="h-4 w-4 text-slate-400" />
            </div>
          )}
        </div>

        {/* Results */}
        {selectedCodes.length < 2 ? (
          <div className="flex items-center justify-center h-[200px] text-slate-500">
            Chọn ít nhất 2 trạm để so sánh
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-[200px] text-slate-500">
            Đang tải dữ liệu so sánh...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[200px] text-red-500">
            Lỗi: {error.message}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Temperature Comparison Bar Chart */}
            <div>
              <h4 className="text-sm font-medium mb-2">So sánh nhiệt độ & độ ẩm</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={temperatureChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#64748b"
                    width={120}
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="temperature"
                    name="Nhiệt độ (°C)"
                    fill="#f59e0b"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="feelsLike"
                    name="Cảm giác (°C)"
                    fill="#ef4444"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar dataKey="humidity" name="Độ ẩm (%)" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Weather Metrics Radar Chart */}
            <div>
              <h4 className="text-sm font-medium mb-2">So sánh tổng quan (chuẩn hóa 0-100)</h4>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={radarChartData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="metric" stroke="#64748b" fontSize={12} />
                  <PolarRadiusAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  {compareData?.stations.map((station, idx) => (
                    <Radar
                      key={station.stationId}
                      name={station.stationName || station.stationId}
                      dataKey={station.stationName || station.stationId}
                      stroke={COLORS[idx % COLORS.length]}
                      fill={COLORS[idx % COLORS.length]}
                      fillOpacity={0.2}
                    />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Table */}
            <div>
              <h4 className="text-sm font-medium mb-2">Chi tiết</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-3 font-medium">Trạm</th>
                      <th className="text-center py-2 px-3 font-medium">Nhiệt độ</th>
                      <th className="text-center py-2 px-3 font-medium">Độ ẩm</th>
                      <th className="text-center py-2 px-3 font-medium">Gió</th>
                      <th className="text-center py-2 px-3 font-medium">Áp suất</th>
                      <th className="text-center py-2 px-3 font-medium">Mây</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareData?.stations.map((station, idx) => {
                      const condition = station.data
                        ? getWeatherCondition(station.data.temperature.current ?? 0)
                        : null;
                      return (
                        <tr key={station.stationId} className="border-b border-slate-100">
                          <td className="py-2 px-3 flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                            />
                            {station.stationName || station.stationId}
                          </td>
                          <td className="text-center py-2 px-3">
                            {station.data ? (
                              <Badge className={condition?.color}>
                                {station.data.temperature.current?.toFixed(1)}°C
                              </Badge>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="text-center py-2 px-3">
                            {station.data?.atmospheric.humidity?.toFixed(0)}%
                          </td>
                          <td className="text-center py-2 px-3">
                            {station.data?.wind.speed?.toFixed(1)} m/s
                          </td>
                          <td className="text-center py-2 px-3">
                            {station.data?.atmospheric.pressure?.toFixed(0)} hPa
                          </td>
                          <td className="text-center py-2 px-3">
                            {station.data?.cloudiness?.toFixed(0)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
