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
          <CardTitle>Xu hướng thời tiết (Quản trị)</CardTitle>
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
                    {data.avgHumidity.toFixed(1)}%
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
