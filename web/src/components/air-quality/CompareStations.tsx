/**
 * Compare Stations Component
 * Displays air quality comparison across multiple stations (admin only)
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
import { useCompareStations } from '@/hooks/useAirQualityQuery';
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

function getAqiColor(aqi: number): string {
  if (aqi <= 50) return 'bg-green-500';
  if (aqi <= 100) return 'bg-yellow-500';
  if (aqi <= 150) return 'bg-orange-500';
  if (aqi <= 200) return 'bg-red-500';
  if (aqi <= 300) return 'bg-purple-500';
  return 'bg-rose-900';
}

export function CompareStations() {
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const { stations, loading: stationsLoading } = useStations({ autoFetch: true });

  const {
    data: compareData,
    isLoading,
    error,
    refetch,
  } = useCompareStations(selectedCodes, selectedCodes.length >= 2);

  // Bar chart data for AQI comparison
  const aqiChartData = useMemo(() => {
    if (!compareData?.stations) return [];
    return compareData.stations
      .filter((s) => s.data)
      .map((s) => ({
        name: s.stationName || s.stationId,
        aqi: s.data?.aqi.epaUS.index ?? 0,
        level: s.data?.aqi.epaUS.level ?? 'N/A',
      }));
  }, [compareData]);

  // Radar chart data for pollutants comparison
  const radarChartData = useMemo(() => {
    if (!compareData?.stations) return [];

    const pollutantNames = ['PM2.5', 'PM10', 'CO', 'NO₂', 'SO₂', 'O₃'];
    const pollutantKeys = ['pm25', 'pm10', 'co', 'no2', 'so2', 'o3'] as const;

    return pollutantNames.map((name, idx) => {
      const key = pollutantKeys[idx];
      const entry: Record<string, string | number> = { pollutant: name };

      compareData.stations.forEach((station, stationIdx) => {
        if (station.data) {
          const value = station.data.pollutants[key];
          entry[station.stationName || station.stationId] = value ?? 0;
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
              <CardTitle>So sánh các trạm quan trắc</CardTitle>
              <CardDescription>Chọn 2-10 trạm để so sánh chất lượng không khí</CardDescription>
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
            {/* AQI Comparison Bar Chart */}
            <div>
              <h4 className="text-sm font-medium mb-2">So sánh AQI</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={aqiChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" domain={[0, 'auto']} />
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
                    formatter={(
                      value: number,
                      name: string,
                      props: { payload?: { level: string } },
                    ) => [`${value} (${props.payload?.level ?? ''})`, 'AQI']}
                  />
                  <Bar dataKey="aqi" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pollutants Radar Chart */}
            <div>
              <h4 className="text-sm font-medium mb-2">So sánh các chất ô nhiễm</h4>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={radarChartData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="pollutant" stroke="#64748b" fontSize={12} />
                  <PolarRadiusAxis stroke="#64748b" fontSize={10} />
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
                      <th className="text-center py-2 px-3 font-medium">AQI</th>
                      <th className="text-center py-2 px-3 font-medium">PM2.5</th>
                      <th className="text-center py-2 px-3 font-medium">PM10</th>
                      <th className="text-center py-2 px-3 font-medium">CO</th>
                      <th className="text-center py-2 px-3 font-medium">NO₂</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareData?.stations.map((station, idx) => (
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
                            <Badge className={getAqiColor(station.data.aqi.epaUS.index)}>
                              {station.data.aqi.epaUS.index}
                            </Badge>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="text-center py-2 px-3">
                          {station.data?.pollutants.pm25?.toFixed(1) ?? '-'}
                        </td>
                        <td className="text-center py-2 px-3">
                          {station.data?.pollutants.pm10?.toFixed(1) ?? '-'}
                        </td>
                        <td className="text-center py-2 px-3">
                          {station.data?.pollutants.co?.toFixed(1) ?? '-'}
                        </td>
                        <td className="text-center py-2 px-3">
                          {station.data?.pollutants.no2?.toFixed(1) ?? '-'}
                        </td>
                      </tr>
                    ))}
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
