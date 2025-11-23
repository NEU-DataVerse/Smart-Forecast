import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { activeAlerts } from '@/services/data/dashboard.api';
interface AlertsActiveProps {
  alerts: typeof activeAlerts;
}

export default function AlertsActive({ alerts }: AlertsActiveProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Active Disaster Alerts</CardTitle>
        <CardDescription className="text-xs">Currently broadcasted warnings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-2.5 border border-slate-200 rounded-lg">
              <div className="flex items-start justify-between mb-1">
                <div className="text-slate-900 text-sm">{alert.type}</div>
                <Badge
                  variant={
                    alert.severity === 'High'
                      ? 'destructive'
                      : alert.severity === 'Medium'
                        ? 'default'
                        : 'secondary'
                  }
                  className="text-xs"
                >
                  {alert.severity}
                </Badge>
              </div>
              <div className="text-slate-500 text-xs">📍 {alert.area}</div>
              <div className="text-slate-400 text-xs">{alert.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
