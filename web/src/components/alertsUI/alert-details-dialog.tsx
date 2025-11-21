import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { MapPin, Users, Send } from 'lucide-react';
import { IAlert } from '@/../../shared/src/types/alert.types';
import { isAlertActive, getTimeUntilExpiration, formatAlertDate } from '@/services/data/alert.api';

interface AlertDetailsDialogProps {
  alert: IAlert | null;
  open: boolean;
  onClose: () => void;
  onResend: (alert: IAlert) => void;
}

export function AlertDetailsDialog({ alert, open, onClose, onResend }: AlertDetailsDialogProps) {
  if (!alert) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Alert Details</DialogTitle>
          <DialogDescription>Complete information about this alert</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-slate-900">{alert.title}</h3>
            <Badge variant={isAlertActive(alert) ? 'default' : 'secondary'}>
              {isAlertActive(alert) ? 'Active' : 'Expired'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Severity Level</Label>
              <Badge
                className="mt-1"
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
            <div>
              <Label>Sent By</Label>
              <p className="text-slate-900 mt-1">{alert.createdBy}</p>
            </div>
            <div>
              <Label>Sent At</Label>
              <p className="text-slate-900 mt-1">{formatAlertDate(alert.sentAt)}</p>
            </div>
            <div>
              <Label>Expires</Label>
              <p className="text-slate-900 mt-1">{getTimeUntilExpiration(alert.expiresAt)}</p>
            </div>
          </div>

          <div>
            <Label>Alert Message</Label>
            <p className="text-slate-900 mt-1 p-3 bg-slate-50 rounded-lg">{alert.message}</p>
          </div>

          <div>
            <Label>Alert Type</Label>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="text-slate-900">{alert.type}</span>
            </div>
          </div>

          <div>
            <Label>Recipients</Label>
            <div className="flex items-center gap-2 mt-1">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-slate-900">
                {(alert.sentCount || 0).toLocaleString()} users notified
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button className="flex-1" onClick={() => onResend(alert)}>
              <Send className="h-4 w-4 mr-2" />
              Resend Alert
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
