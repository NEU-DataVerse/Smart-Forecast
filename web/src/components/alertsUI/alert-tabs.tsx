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
import { IAlert, AlertLevel, AlertType, AlertTypeLabels } from '@smart-forecast/shared';
import { AlertListItem } from './alert-list-item';
import { ChevronLeft, ChevronRight, Filter, X, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertTabsProps {
  alerts: IAlert[];
  onViewAlert: (alert: IAlert) => void;
  onResendAlert: (alert: IAlert) => void;
  isLoading?: boolean;
  // Pagination
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  // Filter by level
  levelFilter?: AlertLevel;
  onLevelFilterChange: (level?: AlertLevel) => void;
  // Filter by type
  typeFilter?: AlertType;
  onTypeFilterChange?: (type?: AlertType) => void;
  // Filter by date range
  startDate?: string;
  endDate?: string;
  onDateRangeChange?: (startDate?: string, endDate?: string) => void;
  // Filter by status (active/expired)
  statusFilter?: 'active' | 'expired';
  onStatusFilterChange?: (status?: 'active' | 'expired') => void;
  // Level counts (from stats API)
  levelCounts?: { LOW: number; MEDIUM: number; HIGH: number; CRITICAL: number; all: number };
}

function AlertCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="h-1 bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="grid grid-cols-4 gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
}

export function AlertTabs({
  alerts,
  onViewAlert,
  onResendAlert,
  isLoading = false,
  page,
  limit,
  total,
  onPageChange,
  levelFilter,
  onLevelFilterChange,
  typeFilter,
  onTypeFilterChange,
  startDate,
  endDate,
  onDateRangeChange,
  statusFilter,
  onStatusFilterChange,
  levelCounts,
}: AlertTabsProps) {
  const totalPages = Math.ceil(total / limit);
  const currentTab = levelFilter ?? 'all';
  const hasFilters = typeFilter || startDate || endDate || statusFilter;

  // Local state for date pickers (only apply filter when both dates are selected)
  const [localStartDate, setLocalStartDate] = useState<Date | undefined>(
    startDate ? new Date(startDate) : undefined,
  );
  const [localEndDate, setLocalEndDate] = useState<Date | undefined>(
    endDate ? new Date(endDate) : undefined,
  );

  // Get count for each tab
  const getCount = (level?: AlertLevel) => {
    if (!levelCounts) return '...';
    if (!level) return levelCounts.all ?? 0;
    return levelCounts[level] ?? 0;
  };

  const handleTabChange = (value: string) => {
    const newLevel = value === 'all' ? undefined : (value as AlertLevel);
    onLevelFilterChange(newLevel);
    onPageChange(1); // Reset to page 1 when changing filter
  };

  const handleClearFilters = () => {
    onTypeFilterChange?.(undefined);
    onDateRangeChange?.(undefined, undefined);
    onStatusFilterChange?.(undefined);
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
          <Label className="text-xs text-slate-500 dark:text-slate-400">Loại cảnh báo</Label>
          <Select
            value={typeFilter ?? 'all'}
            onValueChange={(value) => {
              onTypeFilterChange?.(value === 'all' ? undefined : (value as AlertType));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Tất cả loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              {Object.entries(AlertTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <Label className="text-xs text-slate-500 dark:text-slate-400">Trạng thái</Label>
          <Select
            value={statusFilter ?? 'all'}
            onValueChange={(value) => {
              onStatusFilterChange?.(value === 'all' ? undefined : (value as 'active' | 'expired'));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="expired">Đã hết hạn</SelectItem>
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
          <TabsTrigger value={AlertLevel.CRITICAL} className="text-red-600">
            Khẩn cấp ({getCount(AlertLevel.CRITICAL)})
          </TabsTrigger>
          <TabsTrigger value={AlertLevel.HIGH} className="text-orange-600">
            Cao ({getCount(AlertLevel.HIGH)})
          </TabsTrigger>
          <TabsTrigger value={AlertLevel.MEDIUM} className="text-amber-600">
            Trung bình ({getCount(AlertLevel.MEDIUM)})
          </TabsTrigger>
          <TabsTrigger value={AlertLevel.LOW} className="text-green-600">
            Thấp ({getCount(AlertLevel.LOW)})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab} className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <AlertCardSkeleton key={i} />
              ))}
            </div>
          ) : alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <AlertListItem
                  key={alert.id}
                  alert={alert}
                  onView={onViewAlert}
                  onResend={onResendAlert}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              Không có cảnh báo nào
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, total)} / {total} cảnh báo
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
