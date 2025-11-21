import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, MapPin, Clock, Users, Send, AlertTriangle } from 'lucide-react';
import { IAlert } from '@/../../shared/src/types/alert.types';
import { isAlertActive, getTimeUntilExpiration, formatAlertDate } from '@/services/data/alert.api';

interface AlertListItemProps {
  alert: IAlert;
  onView: (alert: IAlert) => void;
  onResend: (alert: IAlert) => void;
}

export function AlertListItem({ alert, onView, onResend }: AlertListItemProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-slate-900">{alert.title}</h3>
              <Badge variant={isAlertActive(alert) ? 'default' : 'secondary'}>
                {isAlertActive(alert) ? 'Active' : 'Expired'}
              </Badge>
              <Badge
                variant={
                  alert.level === 'CRITICAL' || alert.level === 'HIGH'
                    ? 'destructive'
                    : alert.level === 'MEDIUM'
                      ? 'default'
                      : 'secondary'
                }
              >
                {alert.level}
              </Badge>
            </div>
            <p className="text-slate-600 mb-3">{alert.message}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-slate-500">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{alert.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{(alert.sentCount || 0).toLocaleString()} recipients</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Sent {formatAlertDate(alert.sentAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>{getTimeUntilExpiration(alert.expiresAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 ml-4">
            <Button variant="outline" size="sm" onClick={() => onView(alert)}>
              <Edit className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button size="sm" onClick={() => onResend(alert)}>
              <Send className="h-4 w-4 mr-2" />
              Resend
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
