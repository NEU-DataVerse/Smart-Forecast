import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DateRangeFilter, AdminStatsPanel, LoadingState } from '@/components/shared';

interface AirQualityAveragesProps {
  data?: {
    avgAQI: number;
    avgPM25: number;
    avgPM10: number;
    avgCO: number;
    avgNO2: number;
    avgSO2: number;
    avgO3: number;
    dataPoints: number;
  };
  isLoading: boolean;
  onDateRangeChange: (startDate: string, endDate: string) => void;
}

export function AirQualityAverages({
  data,
  isLoading,
  onDateRangeChange,
}: AirQualityAveragesProps) {
  return (
    <AdminStatsPanel>
      <Card>
        <CardHeader>
          <CardTitle>Air Quality Averages (Admin)</CardTitle>
          <CardDescription>Statistical analysis for selected date range</CardDescription>
        </CardHeader>
        <CardContent>
          <DateRangeFilter onDateRangeChange={onDateRangeChange} />
          {isLoading && <LoadingState message="Loading averages..." />}
          {data && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-500 text-sm">Avg AQI</p>
                  <p className="text-slate-900 text-2xl font-semibold">{data.avgAQI.toFixed(1)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-500 text-sm">Avg PM2.5</p>
                  <p className="text-slate-900 text-2xl font-semibold">
                    {data.avgPM25.toFixed(1)} μg/m³
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-500 text-sm">Avg PM10</p>
                  <p className="text-slate-900 text-2xl font-semibold">
                    {data.avgPM10.toFixed(1)} μg/m³
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
