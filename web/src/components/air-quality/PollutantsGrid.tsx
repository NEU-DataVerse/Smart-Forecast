import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PollutantCard } from './PollutantCard';

interface PollutantsGridProps {
  pollutants: {
    pm25?: number;
    pm10?: number;
    co?: number;
    no2?: number;
    so2?: number;
    o3?: number;
  };
}

export function PollutantsGrid({ pollutants }: PollutantsGridProps) {
  /**
   * EPA National Ambient Air Quality Standards (NAAQS)
   * Limits converted to μg/m³ for consistency
   * PM2.5: 35 μg/m³ (24-hour average)
   * PM10: 150 μg/m³ (24-hour average)
   * CO: 10,000 μg/m³ (~9 ppm, 8-hour average)
   * NO₂: 100 ppb = ~188 μg/m³ (1-hour average)
   * SO₂: 75 ppb = ~196 μg/m³ (1-hour average)
   * O₃: 70 ppb = ~137 μg/m³ (8-hour average)
   */
  const pollutantsArray = [
    { name: 'PM2.5', value: pollutants.pm25 || 0, unit: 'μg/m³', limit: 35, color: '#ef4444' },
    { name: 'PM10', value: pollutants.pm10 || 0, unit: 'μg/m³', limit: 150, color: '#f97316' },
    { name: 'CO', value: pollutants.co || 0, unit: 'μg/m³', limit: 10000, color: '#eab308' },
    { name: 'NO₂', value: pollutants.no2 || 0, unit: 'μg/m³', limit: 188, color: '#06b6d4' },
    { name: 'SO₂', value: pollutants.so2 || 0, unit: 'μg/m³', limit: 196, color: '#8b5cf6' },
    { name: 'O₃', value: pollutants.o3 || 0, unit: 'μg/m³', limit: 137, color: '#3b82f6' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân tích chất ô nhiễm</CardTitle>
        <CardDescription>Mức hiện tại so với giới hạn an toàn</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pollutantsArray.map((pollutant) => (
            <PollutantCard key={pollutant.name} {...pollutant} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
