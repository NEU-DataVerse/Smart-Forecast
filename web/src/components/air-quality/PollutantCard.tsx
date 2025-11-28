import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PollutantCardProps {
  name: string;
  value: number;
  unit: string;
  limit: number;
  color: string;
}

export function PollutantCard({ name, value, unit, limit, color }: PollutantCardProps) {
  const percentage = Math.min((value / limit) * 100, 100);
  const isWarning = percentage > 75;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{name}</h3>
            {isWarning && <AlertTriangle className="h-4 w-4 text-orange-500" />}
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color }}>
              {value.toFixed(1)}
            </p>
            <p className="text-xs text-slate-500">{unit}</p>
          </div>
          <div>
            <Progress value={percentage} className="h-2" />
            <p className="text-xs text-slate-500 mt-1">
              Limit: {limit} {unit}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
