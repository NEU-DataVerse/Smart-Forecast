'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIncidents } from '@/hooks/useIncidentQuery';
import { ListSkeleton } from '@/components/shared/Skeleton';
import { FileText } from 'lucide-react';
import type { IIncident, IncidentStatus } from '@smart-forecast/shared';

// Map IncidentStatus to display config
const statusConfig: Record<
  IncidentStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  PENDING: { label: 'Pending', variant: 'secondary' },
  VERIFIED: { label: 'Verified', variant: 'default' },
  REJECTED: { label: 'Rejected', variant: 'destructive' },
  IN_PROGRESS: { label: 'In Progress', variant: 'outline' },
  RESOLVED: { label: 'Resolved', variant: 'default' },
};

// Format time ago
function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const reportDate = new Date(date);
  const diffMs = now.getTime() - reportDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// Format incident type
function formatIncidentType(type: string): string {
  return type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface RecentReportsProps {
  onSelectReport?: (report: IIncident) => void;
}

export default function RecentReports({ onSelectReport }: RecentReportsProps) {
  const { data, isLoading, error } = useIncidents({ limit: 5 }, { enablePolling: false });

  const reports = data?.data || [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent User Reports</CardTitle>
        <CardDescription className="text-xs">Latest submissions from mobile app</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ListSkeleton items={5} />
        ) : error ? (
          <div className="text-center py-4 text-red-500 text-sm">Failed to load reports</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-6 text-slate-500">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No reports yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {reports.map((report: IIncident) => {
              const config = statusConfig[report.status] || statusConfig.PENDING;
              return (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => onSelectReport?.(report)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-900 text-sm truncate">
                      {report.description?.slice(0, 50) || 'No description'}
                      {report.description && report.description.length > 50 ? '...' : ''}
                    </div>
                    <div className="text-slate-500 text-xs">{formatIncidentType(report.type)}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={config.variant} className="text-xs">
                      {config.label}
                    </Badge>
                    <span className="text-slate-400 text-xs hidden sm:inline">
                      {formatTimeAgo(report.createdAt)}
                    </span>
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
