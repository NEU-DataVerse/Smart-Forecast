'use client';

import { useState, useMemo } from 'react';
import { useAlerts } from '@/hooks/useAlertQuery';
import { IAlert, AlertLevel, AlertType, AlertLevelLabels } from '@smart-forecast/shared';
import { AlertHeader } from '@/components/alertsUI/alert-header';
import SummaryStarts from '@/components/alertsUI/summary-starts';
import { AlertListItem } from '@/components/alertsUI/alert-list-item';
import { AlertDetailsDialog } from '@/components/alertsUI/alert-details-dialog';
import { CreateAlertDialog } from '@/components/alertsUI/create-alert-dialog';
import { ThresholdList } from '@/components/alertsUI/threshold-list';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, AlertTriangle, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Alert type labels in Vietnamese
const AlertTypeLabels: Record<AlertType, string> = {
  [AlertType.WEATHER]: 'Thời tiết',
  [AlertType.AIR_QUALITY]: 'Chất lượng không khí',
  [AlertType.DISASTER]: 'Thiên tai',
  [AlertType.ENVIRONMENTAL]: 'Môi trường',
};

export default function AlertsPage() {
  // Dialog states
  const [selectedAlert, setSelectedAlert] = useState<IAlert | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [resendAlert, setResendAlert] = useState<IAlert | null>(null);

  // Filter states
  const [levelFilter, setLevelFilter] = useState<AlertLevel | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<AlertType | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Build query params
  const queryParams = useMemo(
    () => ({
      page,
      limit,
      ...(levelFilter !== 'ALL' && { level: levelFilter }),
      ...(typeFilter !== 'ALL' && { type: typeFilter }),
    }),
    [page, limit, levelFilter, typeFilter],
  );

  // Fetch alerts
  const { data, isLoading, isError, error, refetch } = useAlerts(queryParams);

  const alerts = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Handlers
  const handleViewAlert = (alert: IAlert) => {
    setSelectedAlert(alert);
    setShowDetailsDialog(true);
  };

  const handleOpenResendDialog = (alert: IAlert) => {
    setResendAlert(alert);
    setShowCreateDialog(true);
    setShowDetailsDialog(false);
  };

  const handleCloseDialogs = () => {
    setSelectedAlert(null);
    setShowDetailsDialog(false);
  };

  const handleCloseCreateDialog = () => {
    setShowCreateDialog(false);
    setResendAlert(null);
  };

  const handleCreateClick = () => {
    setResendAlert(null);
    setShowCreateDialog(true);
  };

  const clearFilters = () => {
    setLevelFilter('ALL');
    setTypeFilter('ALL');
    setPage(1);
  };

  const hasFilters = levelFilter !== 'ALL' || typeFilter !== 'ALL';

  return (
    <div className="space-y-6">
      <AlertHeader onCreateClick={handleCreateClick} />
      <SummaryStarts />

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList>
          <TabsTrigger value="alerts">Lịch sử cảnh báo</TabsTrigger>
          <TabsTrigger value="thresholds">Ngưỡng cảnh báo</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600">Lọc theo:</span>
                </div>

                <Select
                  value={levelFilter}
                  onValueChange={(v) => {
                    setLevelFilter(v as AlertLevel | 'ALL');
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Mức độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả mức độ</SelectItem>
                    {Object.values(AlertLevel).map((level) => (
                      <SelectItem key={level} value={level}>
                        {AlertLevelLabels[level]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={typeFilter}
                  onValueChange={(v) => {
                    setTypeFilter(v as AlertType | 'ALL');
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Loại cảnh báo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả loại</SelectItem>
                    {Object.values(AlertType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {AlertTypeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Xóa bộ lọc
                  </Button>
                )}

                <div className="ml-auto text-sm text-slate-500">
                  {total > 0 && `Tìm thấy ${total} cảnh báo`}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert list */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              <span className="ml-2 text-slate-500">Đang tải dữ liệu...</span>
            </div>
          ) : isError ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Không thể tải dữ liệu</h3>
                <p className="text-slate-500 mb-4">
                  {error instanceof Error ? error.message : 'Đã xảy ra lỗi'}
                </p>
                <Button onClick={() => refetch()}>Thử lại</Button>
              </CardContent>
            </Card>
          ) : alerts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertTriangle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Chưa có cảnh báo nào</h3>
                <p className="text-slate-500 mb-4">
                  {hasFilters
                    ? 'Không tìm thấy cảnh báo nào phù hợp với bộ lọc'
                    : 'Hệ thống chưa có cảnh báo nào được gửi'}
                </p>
                {hasFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Xóa bộ lọc
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <AlertListItem
                    key={alert.id}
                    alert={alert}
                    onView={handleViewAlert}
                    onResend={handleOpenResendDialog}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-slate-600">
                    Trang {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="thresholds">
          <ThresholdList />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AlertDetailsDialog
        alert={selectedAlert}
        open={showDetailsDialog}
        onClose={handleCloseDialogs}
        onResend={handleOpenResendDialog}
      />

      <CreateAlertDialog
        open={showCreateDialog}
        onClose={handleCloseCreateDialog}
        prefillData={resendAlert}
      />
    </div>
  );
}
