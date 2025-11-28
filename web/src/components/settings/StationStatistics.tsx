/**
 * Station Statistics Component
 * Displays station statistics in card format
 */

import { Card, CardContent } from '@/components/ui/card';
import { Radio, Activity, TrendingUp } from 'lucide-react';
import type { StationStatsResponse } from '@/types/dto';

interface StationStatisticsProps {
  stats: StationStatsResponse | null;
}

export function StationStatistics({ stats }: StationStatisticsProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Total Stations</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <Radio className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Inactive</p>
              <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
            </div>
            <Radio className="h-8 w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Maintenance</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
