import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface WeatherMetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

export function WeatherMetricCard({
  icon: Icon,
  title,
  value,
  unit,
  subValue,
  trend,
  color = 'text-blue-500',
}: WeatherMetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <p className="text-2xl font-semibold text-slate-900">
                {value}
                {unit && <span className="text-lg text-slate-500 ml-1">{unit}</span>}
              </p>
            </div>
            {subValue && <p className="text-xs text-slate-400 mt-1">{subValue}</p>}
          </div>
          <div className={`p-3 rounded-lg bg-slate-50 ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
