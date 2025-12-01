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
  // Helper to format humidity - handle both 0-1 scale and already % values
  const formatHumidity = (value: number): string => {
    // If value > 1, it's already in % format, don't multiply by 100
    if (value > 1) {
      return value.toFixed(1);
    }
    return (value * 100).toFixed(1);
  };

  return (
    <AdminStatsPanel>
      <Card>
        <CardHeader>
          <CardTitle>Xu hướng thời tiết</CardTitle>
          <CardDescription>Phân tích thống kê cho khoảng thời gian đã chọn</CardDescription>
        </CardHeader>
        <CardContent>
          <DateRangeFilter onDateRangeChange={onDateRangeChange} />
          {isLoading && <LoadingState message="Đang tải xu hướng..." />}
          {data && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-500 text-sm">Nhiệt độ TB</p>
                  <p className="text-slate-900 text-2xl font-semibold">
                    {data.avgTemperature.toFixed(1)}°C
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-500 text-sm">Lượng mưa TB</p>
                  <p className="text-slate-900 text-2xl font-semibold">
                    {data.avgRainfall.toFixed(1)} mm
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-500 text-sm">Độ ẩm TB</p>
                  <p className="text-slate-900 text-2xl font-semibold">
                    {formatHumidity(data.avgHumidity)}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-500 text-sm">Số điểm dữ liệu</p>
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
