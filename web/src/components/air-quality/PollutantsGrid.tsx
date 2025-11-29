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
  const pollutantsArray = [
    { name: 'PM2.5', value: pollutants.pm25 || 0, unit: 'μg/m³', limit: 35, color: '#ef4444' },
    { name: 'PM10', value: pollutants.pm10 || 0, unit: 'μg/m³', limit: 150, color: '#f97316' },
    { name: 'CO', value: pollutants.co || 0, unit: 'μg/m³', limit: 10000, color: '#eab308' },
    { name: 'NO₂', value: pollutants.no2 || 0, unit: 'μg/m³', limit: 100, color: '#06b6d4' },
    { name: 'SO₂', value: pollutants.so2 || 0, unit: 'μg/m³', limit: 75, color: '#8b5cf6' },
    { name: 'O₃', value: pollutants.o3 || 0, unit: 'μg/m³', limit: 100, color: '#3b82f6' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pollutants Breakdown</CardTitle>
        <CardDescription>Current levels vs. safe limits</CardDescription>
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
