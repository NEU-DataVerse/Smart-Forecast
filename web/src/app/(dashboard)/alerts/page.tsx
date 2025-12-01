'use client';

import { useState, useMemo } from 'react';
import { useAlerts, useAlertStats } from '@/hooks/useAlertQuery';
import { IAlert, AlertLevel, AlertType } from '@smart-forecast/shared';
import { AlertHeader } from '@/components/alertsUI/alert-header';
import SummaryStarts from '@/components/alertsUI/summary-starts';
import { AlertDetailsDialog } from '@/components/alertsUI/alert-details-dialog';
import { CreateAlertDialog } from '@/components/alertsUI/create-alert-dialog';
import { ThresholdList } from '@/components/alertsUI/threshold-list';
import { AlertTabs } from '@/components/alertsUI/alert-tabs';
import { AlertsMapView } from '@/components/alertsUI/alerts-map-view';
import { AlertStatsDashboard } from '@/components/alertsUI/alert-stats-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, List, BarChart3, Settings } from 'lucide-react';

const PAGE_SIZE = 10;
const MAP_PAGE_SIZE = 200; // Load more alerts for map view

export default function AlertsPage() {
  // View state
  const [activeView, setActiveView] = useState<'map' | 'list' | 'dashboard' | 'thresholds'>('list');

  // Dialog states
  const [selectedAlert, setSelectedAlert] = useState<IAlert | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [resendAlert, setResendAlert] = useState<IAlert | null>(null);

  // Filter states
  const [levelFilter, setLevelFilter] = useState<AlertLevel | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<AlertType | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<'active' | 'expired' | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  // Build query params for list view
  const queryParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      ...(levelFilter && { level: levelFilter }),
      ...(typeFilter && { type: typeFilter }),
      ...(statusFilter && { status: statusFilter }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    }),
    [page, levelFilter, typeFilter, statusFilter, startDate, endDate],
  );

  // Build query params for map view (more data)
  const mapQueryParams = useMemo(
    () => ({
      page: 1,
      limit: MAP_PAGE_SIZE,
      ...(levelFilter && { level: levelFilter }),
      ...(typeFilter && { type: typeFilter }),
      ...(statusFilter && { status: statusFilter }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    }),
    [levelFilter, typeFilter, statusFilter, startDate, endDate],
  );

  // Fetch alerts
  const { data, isLoading } = useAlerts(queryParams);
  const { data: mapData, isLoading: isLoadingMap } = useAlerts(mapQueryParams);
  const { data: statsData } = useAlertStats();

  const alerts = data?.data || [];
  const total = data?.total || 0;

  // Calculate level counts from stats
  const levelCounts = useMemo(() => {
    if (!statsData) return undefined;
    return {
      ...statsData.byLevel,
      all: statsData.total,
    };
  }, [statsData]);

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

  const handleLevelFilterChange = (level?: AlertLevel) => {
    setLevelFilter(level);
    setPage(1);
  };

  const handleTypeFilterChange = (type?: AlertType) => {
    setTypeFilter(type);
    setPage(1);
  };

  const handleStatusFilterChange = (status?: 'active' | 'expired') => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleDateRangeChange = (start?: string, end?: string) => {
    setStartDate(start);
    setEndDate(end);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-6">
      <AlertHeader onCreateClick={handleCreateClick} />

      {/* View Toggle */}
      <Tabs
        value={activeView}
        onValueChange={(v) => setActiveView(v as 'map' | 'list' | 'dashboard' | 'thresholds')}
      >
        <TabsList>
          <TabsTrigger value="map" className="gap-2">
            <MapPin className="h-4 w-4" />
            Bản đồ
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            Danh sách
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Thống kê
          </TabsTrigger>
          <TabsTrigger value="thresholds" className="gap-2">
            <Settings className="h-4 w-4" />
            Ngưỡng cảnh báo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="mt-6">
          <AlertsMapView
            alerts={mapData?.data ?? []}
            isLoading={isLoadingMap}
            onSelectAlert={handleViewAlert}
          />
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <AlertTabs
            alerts={alerts}
            onViewAlert={handleViewAlert}
            onResendAlert={handleOpenResendDialog}
            isLoading={isLoading}
            page={page}
            limit={PAGE_SIZE}
            total={total}
            onPageChange={handlePageChange}
            levelFilter={levelFilter}
            onLevelFilterChange={handleLevelFilterChange}
            typeFilter={typeFilter}
            onTypeFilterChange={handleTypeFilterChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={handleDateRangeChange}
            levelCounts={levelCounts}
          />
        </TabsContent>

        <TabsContent value="dashboard" className="mt-6">
          <SummaryStarts />
          <div className="mt-6">
            <AlertStatsDashboard />
          </div>
        </TabsContent>

        <TabsContent value="thresholds" className="mt-6">
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
