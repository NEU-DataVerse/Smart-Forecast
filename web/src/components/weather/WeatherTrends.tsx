import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DateRangeFilter, AdminStatsPanel, LoadingState } from '@/components/shared';

interface WeatherTrendsProps {
  data?: {
    avgTemperature: number;
    avgRainfall: number;
    avgHumidity: number;
    dataPoints: number;
  };
  isLoading: boolean;
  onDateRangeChange: (startDate: string, endDate: string) => void;
}

export function WeatherTrends({ data, isLoading, onDateRangeChange }: WeatherTrendsProps) {
  return (
    <AdminStatsPanel>
      <Card>
        <CardHeader>
          <CardTitle>Weather Trends (Admin)</CardTitle>
          <CardDescription>Statistical analysis for selected date range</CardDescription>
        </CardHeader>
        <CardContent>
          <DateRangeFilter onDateRangeChange={onDateRangeChange} />
          {isLoading && <LoadingState message="Loading trends..." />}
          {data && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-500 text-sm">Avg Temperature</p>
                  <p className="text-slate-900 text-2xl font-semibold">
                    {data.avgTemperature.toFixed(1)}°C
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-500 text-sm">Avg Rainfall</p>
                  <p className="text-slate-900 text-2xl font-semibold">
                    {data.avgRainfall.toFixed(1)} mm
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-500 text-sm">Avg Humidity</p>
                  <p className="text-slate-900 text-2xl font-semibold">
                    {data.avgHumidity.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-500 text-sm">Data Points</p>
                  <p className="text-slate-900 text-2xl font-semibold">{data.dataPoints}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminStatsPanel>
  );
}
