'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useActiveAlerts } from '@/hooks/useAlertQuery';
import { ListSkeleton } from '@/components/shared/Skeleton';
import { AlertTriangle } from 'lucide-react';
import type { IAlert, AlertLevel } from '@smart-forecast/shared';

// Map AlertLevel to display text and variant
const levelConfig: Record<
  AlertLevel,
  { label: string; variant: 'destructive' | 'default' | 'secondary' }
> = {
  CRITICAL: { label: 'Critical', variant: 'destructive' },
  HIGH: { label: 'High', variant: 'destructive' },
  MEDIUM: { label: 'Medium', variant: 'default' },
  LOW: { label: 'Low', variant: 'secondary' },
};

// Format time ago
function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const alertDate = new Date(date);
  const diffMs = now.getTime() - alertDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export default function AlertsActive() {
  const { data: alerts, isLoading, error } = useActiveAlerts();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Active Disaster Alerts</CardTitle>
        <CardDescription className="text-xs">Currently broadcasted warnings</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ListSkeleton items={3} />
        ) : error ? (
          <div className="text-center py-4 text-red-500 text-sm">Failed to load alerts</div>
        ) : !alerts || alerts.length === 0 ? (
          <div className="text-center py-6 text-slate-500">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No active alerts</p>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert: IAlert) => {
              const config = levelConfig[alert.level] || levelConfig.LOW;
              return (
                <div key={alert.id} className="p-2.5 border border-slate-200 rounded-lg">
                  <div className="flex items-start justify-between mb-1">
                    <div className="text-slate-900 text-sm">{alert.title}</div>
                    <Badge variant={config.variant} className="text-xs">
                      {config.label}
                    </Badge>
                  </div>
                  <div className="text-slate-500 text-xs line-clamp-2">{alert.message}</div>
                  <div className="text-slate-400 text-xs mt-1">
                    {alert.sentAt ? formatTimeAgo(alert.sentAt) : 'Unknown time'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
