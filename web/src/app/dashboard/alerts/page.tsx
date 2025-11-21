import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, Send, Edit, MapPin, Clock, Users } from 'lucide-react';
import { Textarea } from '@/components/ui/text-area';
import { Label } from '@/components/ui/label';
import {
  alertHistory,
  isAlertActive,
  getTimeUntilExpiration,
  formatAlertDate,
} from '@/services/data';
import { IAlert } from '@/../../shared/src/types/alert.types';
import SummaryStarts from '@/components/alertsUI/summary-starts';

export function Alerts() {
  const [selectedAlert, setSelectedAlert] = useState<IAlert | null>(null);
  const [showResendDialog, setShowResendDialog] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleResend = () => {
    console.log('Resending alert:', resendMessage);
    setShowResendDialog(false);
    setResendMessage('');
    setSelectedAlert(null);
  };

  const openResendDialog = (alert: IAlert) => {
    setSelectedAlert(alert);
    setResendMessage(alert.message);
    setShowResendDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900">Alert History</h2>
          <p className="text-slate-500">View and manage sent disaster alerts</p>
        </div>
        <Button>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Create New Alert
        </Button>
      </div>

      {/* Summary Stats */}
      <SummaryStarts />

      {/* Alert List */}
      <div className="space-y-4">
        {alertHistory.map((alert) => (
          <Card key={alert.id}>
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
                  <Button variant="outline" size="sm" onClick={() => setSelectedAlert(alert)}>
                    <Edit className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" onClick={() => openResendDialog(alert)}>
                    <Send className="h-4 w-4 mr-2" />
                    Resend
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert Details Dialog */}
      <Dialog
        open={!!selectedAlert && !showResendDialog}
        onOpenChange={() => setSelectedAlert(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Alert Details</DialogTitle>
            <DialogDescription>Complete information about this alert</DialogDescription>
          </DialogHeader>

          {selectedAlert && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-slate-900">{selectedAlert.title}</h3>
                <Badge variant={isAlertActive(selectedAlert) ? 'default' : 'secondary'}>
                  {isAlertActive(selectedAlert) ? 'Active' : 'Expired'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Severity Level</Label>
                  <Badge
                    className="mt-1"
                    variant={
                      selectedAlert.level === 'CRITICAL' || selectedAlert.level === 'HIGH'
                        ? 'destructive'
                        : selectedAlert.level === 'MEDIUM'
                          ? 'default'
                          : 'secondary'
                    }
                  >
                    {selectedAlert.level}
                  </Badge>
                </div>
                <div>
                  <Label>Sent By</Label>
                  <p className="text-slate-900 mt-1">{selectedAlert.createdBy}</p>
                </div>
                <div>
                  <Label>Sent At</Label>
                  <p className="text-slate-900 mt-1">{formatAlertDate(selectedAlert.sentAt)}</p>
                </div>
                <div>
                  <Label>Expires</Label>
                  <p className="text-slate-900 mt-1">
                    {getTimeUntilExpiration(selectedAlert.expiresAt)}
                  </p>
                </div>
              </div>

              <div>
                <Label>Alert Message</Label>
                <p className="text-slate-900 mt-1 p-3 bg-slate-50 rounded-lg">
                  {selectedAlert.message}
                </p>
              </div>

              <div>
                <Label>Alert Type</Label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-slate-900">{selectedAlert.type}</span>
                </div>
              </div>

              <div>
                <Label>Recipients</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-slate-900">
                    {(selectedAlert.sentCount || 0).toLocaleString()} users notified
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1" onClick={() => openResendDialog(selectedAlert)}>
                  <Send className="h-4 w-4 mr-2" />
                  Resend Alert
                </Button>
                <Button variant="outline" onClick={() => setSelectedAlert(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resend Alert Dialog */}
      <Dialog open={showResendDialog} onOpenChange={setShowResendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resend Alert</DialogTitle>
            <DialogDescription>Update and resend this alert to nearby areas</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Alert Title</Label>
              <p className="text-slate-900 mt-1">{selectedAlert?.title}</p>
            </div>

            <div>
              <Label>Alert Type</Label>
              <p className="text-slate-900 mt-1">{selectedAlert?.type}</p>
            </div>

            <div>
              <Label>Alert Message</Label>
              <Textarea
                placeholder="Enter or update alert message..."
                value={resendMessage}
                onChange={(e) => setResendMessage(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleResend} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Resend Alert
              </Button>
              <Button variant="outline" onClick={() => setShowResendDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
