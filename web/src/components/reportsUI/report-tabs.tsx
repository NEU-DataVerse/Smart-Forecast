'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { IIncident, IncidentStatus } from '@smart-forecast/shared';
import { ReportCard } from './report-card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReportTabsProps {
  reports: IIncident[];
  onSelectReport: (report: IIncident) => void;
  isLoading?: boolean;
  // Pagination
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  // Filter by status
  statusFilter?: IncidentStatus;
  onStatusFilterChange: (status?: IncidentStatus) => void;
  // Status counts (from stats API)
  statusCounts?: Record<IncidentStatus | 'all', number>;
}

function ReportCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex">
        <Skeleton className="w-28 h-28 shrink-0" />
        <div className="flex-1 p-4 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex justify-between pt-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReportTabs({
  reports,
  onSelectReport,
  isLoading = false,
  page,
  limit,
  total,
  onPageChange,
  statusFilter,
  onStatusFilterChange,
  statusCounts,
}: ReportTabsProps) {
  const totalPages = Math.ceil(total / limit);
  const currentTab = statusFilter ?? 'all';

  // Get count for each tab
  const getCount = (status?: IncidentStatus) => {
    if (!statusCounts) return '...';
    if (!status) return statusCounts.all ?? 0;
    return statusCounts[status] ?? 0;
  };

  const handleTabChange = (value: string) => {
    const newStatus = value === 'all' ? undefined : (value as IncidentStatus);
    onStatusFilterChange(newStatus);
    onPageChange(1); // Reset to page 1 when changing filter
  };

  return (
    <div className="space-y-4">
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">Tất cả ({getCount()})</TabsTrigger>
          <TabsTrigger value={IncidentStatus.PENDING}>
            Chờ xử lý ({getCount(IncidentStatus.PENDING)})
          </TabsTrigger>
          <TabsTrigger value={IncidentStatus.VERIFIED}>
            Đã xác nhận ({getCount(IncidentStatus.VERIFIED)})
          </TabsTrigger>
          <TabsTrigger value={IncidentStatus.REJECTED}>
            Đã từ chối ({getCount(IncidentStatus.REJECTED)})
          </TabsTrigger>
          <TabsTrigger value={IncidentStatus.RESOLVED}>
            Đã giải quyết ({getCount(IncidentStatus.RESOLVED)})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab} className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ReportCardSkeleton key={i} />
              ))}
            </div>
          ) : reports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} onClick={onSelectReport} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">Không có báo cáo nào</div>
          )}
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-sm text-slate-500">
            Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, total)} / {total} báo cáo
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-slate-700">
              Trang {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
