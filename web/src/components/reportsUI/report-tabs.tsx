'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  IIncident,
  IncidentStatus,
  IncidentType,
  IncidentTypeLabels,
} from '@smart-forecast/shared';
import { ReportCard } from './report-card';
import { ChevronLeft, ChevronRight, Filter, X, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  // Filter by type
  typeFilter?: IncidentType;
  onTypeFilterChange?: (type?: IncidentType) => void;
  // Filter by date range
  startDate?: string;
  endDate?: string;
  onDateRangeChange?: (startDate?: string, endDate?: string) => void;
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
  typeFilter,
  onTypeFilterChange,
  startDate,
  endDate,
  onDateRangeChange,
  statusCounts,
}: ReportTabsProps) {
  const totalPages = Math.ceil(total / limit);
  const currentTab = statusFilter ?? 'all';
  const hasFilters = typeFilter || startDate || endDate;

  // Local state for date pickers (only apply filter when both dates are selected)
  const [localStartDate, setLocalStartDate] = useState<Date | undefined>(
    startDate ? new Date(startDate) : undefined,
  );
  const [localEndDate, setLocalEndDate] = useState<Date | undefined>(
    endDate ? new Date(endDate) : undefined,
  );

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

  const handleClearFilters = () => {
    onTypeFilterChange?.(undefined);
    onDateRangeChange?.(undefined, undefined);
    setLocalStartDate(undefined);
    setLocalEndDate(undefined);
    onPageChange(1);
  };

  // Apply date filter only when both dates are selected
  const handleStartDateSelect = (date: Date | undefined) => {
    setLocalStartDate(date);
    if (date && localEndDate) {
      // Both dates selected, apply filter
      onDateRangeChange?.(format(date, 'yyyy-MM-dd'), format(localEndDate, 'yyyy-MM-dd'));
      onPageChange(1);
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setLocalEndDate(date);
    if (localStartDate && date) {
      // Both dates selected, apply filter
      onDateRangeChange?.(format(localStartDate, 'yyyy-MM-dd'), format(date, 'yyyy-MM-dd'));
      onPageChange(1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-end gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Filter className="h-4 w-4" />
          <span>Bộ lọc:</span>
        </div>

        {/* Type Filter */}
        <div className="space-y-1">
          <Label className="text-xs text-slate-500 dark:text-slate-400">Loại sự cố</Label>
          <Select
            value={typeFilter ?? 'all'}
            onValueChange={(value) => {
              onTypeFilterChange?.(value === 'all' ? undefined : (value as IncidentType));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Tất cả loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              {Object.entries(IncidentTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-1">
          <Label className="text-xs text-slate-500 dark:text-slate-400">Từ ngày</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-[150px] h-9 justify-start text-left font-normal',
                  !localStartDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {localStartDate ? format(localStartDate, 'dd/MM/yyyy') : 'Chọn ngày'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={localStartDate}
                onSelect={handleStartDateSelect}
                locale={vi}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-slate-500 dark:text-slate-400">Đến ngày</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-[150px] h-9 justify-start text-left font-normal',
                  !localEndDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {localEndDate ? format(localEndDate, 'dd/MM/yyyy') : 'Chọn ngày'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={localEndDate}
                onSelect={handleEndDateSelect}
                disabled={(date) => (localStartDate ? date < localStartDate : false)}
                locale={vi}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Applied date range indicator */}
        {startDate && endDate && (
          <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
            <span>
              Đang lọc: {format(new Date(startDate), 'dd/MM/yyyy')} -{' '}
              {format(new Date(endDate), 'dd/MM/yyyy')}
            </span>
          </div>
        )}

        {/* Clear Filters */}
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-9">
            <X className="h-4 w-4 mr-1" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="all">Tất cả ({getCount()})</TabsTrigger>
          <TabsTrigger value={IncidentStatus.PENDING}>
            Chờ xử lý ({getCount(IncidentStatus.PENDING)})
          </TabsTrigger>
          <TabsTrigger value={IncidentStatus.VERIFIED}>
            Đã xác nhận ({getCount(IncidentStatus.VERIFIED)})
          </TabsTrigger>
          <TabsTrigger value={IncidentStatus.IN_PROGRESS}>
            Đang xử lý ({getCount(IncidentStatus.IN_PROGRESS)})
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
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              Không có báo cáo nào
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
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
            <span className="text-sm text-slate-700 dark:text-slate-300">
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
