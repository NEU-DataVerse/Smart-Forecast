import { AlertTriangle, Send, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { alertHistory, getActiveAlerts } from '@/services/data/alert.api';

export default function SummaryStarts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-slate-500">Active Alerts</p>
              <p className="text-slate-900">{getActiveAlerts().length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-slate-500">Total Recipients</p>
              <p className="text-slate-900">
                {alertHistory.reduce((sum, a) => sum + (a.sentCount || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-3 rounded-lg">
              <Send className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-slate-500">Alerts Sent (24h)</p>
              <p className="text-slate-900">4</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
