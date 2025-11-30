import { AlertTriangle, Send, Users, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useActiveAlerts, useAlerts } from '@/hooks/useAlertQuery';
import { useMemo } from 'react';

export default function SummaryStarts() {
  const { data: activeAlerts, isLoading: isLoadingActive } = useActiveAlerts();
  const { data: alertsData, isLoading: isLoadingAlerts } = useAlerts({ limit: 100 });

  // Calculate stats
  const stats = useMemo(() => {
    const alerts = alertsData?.data || [];
    const active = activeAlerts || [];

    // Count alerts sent in last 24 hours
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last24hCount = alerts.filter((a) => new Date(a.sentAt) >= oneDayAgo).length;

    // Total recipients
    const totalRecipients = alerts.reduce((sum, a) => sum + (a.sentCount || 0), 0);

    return {
      activeCount: active.length,
      totalRecipients,
      last24hCount,
    };
  }, [activeAlerts, alertsData]);

  const isLoading = isLoadingActive || isLoadingAlerts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Cảnh báo đang hoạt động</p>
              <p className="text-2xl font-bold text-slate-900">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats.activeCount}
              </p>
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
              <p className="text-slate-500 text-sm">Tổng số người nhận</p>
              <p className="text-2xl font-bold text-slate-900">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  stats.totalRecipients.toLocaleString()
                )}
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
              <p className="text-slate-500 text-sm">Cảnh báo (24h qua)</p>
              <p className="text-2xl font-bold text-slate-900">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats.last24hCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
