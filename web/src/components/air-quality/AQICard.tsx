import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface AQICardProps {
  index: number;
  level: string;
  location: string;
  timestamp: string;
  scale: 'epa' | 'openweather';
}

function getAQIColor(index: number): string {
  if (index <= 50) return 'text-green-600';
  if (index <= 100) return 'text-yellow-600';
  if (index <= 150) return 'text-orange-600';
  if (index <= 200) return 'text-red-600';
  if (index <= 300) return 'text-purple-600';
  return 'text-maroon-600';
}

function getAQIBgColor(index: number): string {
  if (index <= 50) return 'bg-green-50';
  if (index <= 100) return 'bg-yellow-50';
  if (index <= 150) return 'bg-orange-50';
  if (index <= 200) return 'bg-red-50';
  if (index <= 300) return 'bg-purple-50';
  return 'bg-maroon-50';
}

function getHealthMessage(index: number): string {
  if (index <= 50) return 'Air quality is satisfactory';
  if (index <= 100) return 'Acceptable for most people';
  if (index <= 150) return 'Sensitive groups may experience health effects';
  if (index <= 200) return 'Everyone may experience health effects';
  if (index <= 300) return 'Health warning: everyone may experience serious effects';
  return 'Health alert: emergency conditions';
}

export function AQICard({ index, level, location, timestamp, scale }: AQICardProps) {
  if (scale === 'epa') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Air Quality Index (EPA)</CardTitle>
          <CardDescription>{location}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className={`text-6xl font-bold ${getAQIColor(index)}`}>{index}</div>
            <div className={`px-4 py-2 rounded-lg ${getAQIBgColor(index)}`}>
              <p className={`font-semibold ${getAQIColor(index)}`}>{level}</p>
            </div>
            <p className="text-slate-500 text-center text-sm">{getHealthMessage(index)}</p>
            <Progress value={(index / 500) * 100} className="w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Air Quality Index (OpenWeather)</CardTitle>
        <CardDescription>Scale 1-5</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="text-6xl font-bold text-blue-600">{index}/5</div>
          <div className="px-4 py-2 rounded-lg bg-blue-50">
            <p className="font-semibold text-blue-600">{level}</p>
          </div>
          <p className="text-slate-500 text-sm">Updated: {timestamp}</p>
          <div className="flex gap-1 w-full">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <div
                key={lvl}
                className={`flex-1 h-2 rounded ${lvl <= index ? 'bg-blue-600' : 'bg-slate-200'}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
