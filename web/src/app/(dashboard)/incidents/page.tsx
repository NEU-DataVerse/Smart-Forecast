'use client';

import { useState, useMemo } from 'react';
import {
  IIncident,
  IncidentStatus,
  AlertLevel,
  AlertType,
  IncidentType,
  IncidentTypeLabels,
} from '@smart-forecast/shared';
import {
  useIncidents,
  useIncidentStatsByStatus,
  useUpdateIncidentStatus,
} from '@/hooks/useIncidentQuery';
import { useCreateAlert } from '@/hooks/useAlertQuery';
import { ReportHeader } from '@/components/reportsUI/report-header';
import { ReportTabs } from '@/components/reportsUI/report-tabs';
import { ReportDetailsDialog } from '@/components/reportsUI/report-details-dialog';
import { CreateAlertDialog } from '@/components/reportsUI/create-alert-dialog';
import { IncidentStatsDashboard } from '@/components/reportsUI/incident-stats-dashboard';
import { IncidentsMapView } from '@/components/reportsUI/incidents-map-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, List, MapPin } from 'lucide-react';

const PAGE_SIZE = 10;
const MAP_PAGE_SIZE = 500; // Load more incidents for map view

export default function ReportsPage() {
  // View state
  const [activeView, setActiveView] = useState<'map' | 'list' | 'dashboard'>('list');

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<IncidentType | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  // Dialog state
  const [selectedReport, setSelectedReport] = useState<IIncident | null>(null);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertLevel, setAlertLevel] = useState<AlertLevel>(AlertLevel.HIGH);
  const [alertType, setAlertType] = useState<AlertType>(AlertType.DISASTER);
  const [alertBuffer, setAlertBuffer] = useState(500); // Default 500m

  // API queries - list view
  const { data: incidentsData, isLoading: isLoadingIncidents } = useIncidents({
    page,
    limit: PAGE_SIZE,
    status: statusFilter,
    type: typeFilter,
    startDate,
    endDate,
  });

  // API queries - map view (load more incidents)
  const { data: mapIncidentsData, isLoading: isLoadingMapIncidents } = useIncidents({
    page: 1,
    limit: MAP_PAGE_SIZE,
    status: statusFilter,
    type: typeFilter,
    startDate,
    endDate,
  });

  const { data: statusStats } = useIncidentStatsByStatus({ enablePolling: true });

  // Mutation
  const updateStatusMutation = useUpdateIncidentStatus();
  const createAlertMutation = useCreateAlert();

  // Calculate status counts from stats data
  const statusCounts = useMemo(() => {
    if (!statusStats) return undefined;

    const counts: Record<IncidentStatus | 'all', number> = {
      all: 0,
      [IncidentStatus.PENDING]: 0,
      [IncidentStatus.VERIFIED]: 0,
      [IncidentStatus.REJECTED]: 0,
      [IncidentStatus.IN_PROGRESS]: 0,
      [IncidentStatus.RESOLVED]: 0,
    };

    statusStats.forEach((stat) => {
      const countValue = Number(stat.count) || 0; // Ensure it's a number
      if (stat.status in IncidentStatus) {
        counts[stat.status as IncidentStatus] = countValue;
        counts.all += countValue;
      }
    });

    return counts;
  }, [statusStats]);

  // Handlers
  const handleSelectReport = (report: IIncident) => {
    setSelectedReport(report);
    setShowCreateAlert(false);
  };

  const handleApprove = async (reportId: string, notes?: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: reportId,
        data: {
          status: IncidentStatus.VERIFIED,
          notes,
        },
      });
      setSelectedReport(null);
    } catch (error) {
      // Error is already handled by the mutation hook (toast)
      console.error('Failed to approve report:', error);
    }
  };

  const handleReject = async (reportId: string, notes: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: reportId,
        data: {
          status: IncidentStatus.REJECTED,
          notes,
        },
      });
      setSelectedReport(null);
    } catch (error) {
      console.error('Failed to reject report:', error);
    }
  };

  const handleOpenCreateAlert = () => {
    if (selectedReport) {
      // Map incident type to alert type
      const typeMap: Partial<Record<IncidentType, AlertType>> = {
        [IncidentType.FLOODING]: AlertType.DISASTER,
        [IncidentType.FALLEN_TREE]: AlertType.DISASTER,
        [IncidentType.LANDSLIDE]: AlertType.DISASTER,
        [IncidentType.AIR_POLLUTION]: AlertType.AIR_QUALITY,
        [IncidentType.ROAD_DAMAGE]: AlertType.DISASTER,
        [IncidentType.OTHER]: AlertType.ENVIRONMENTAL,
      };
      setAlertType(typeMap[selectedReport.type] || AlertType.DISASTER);
      setAlertLevel(AlertLevel.HIGH);
    }
    setShowCreateAlert(true);
  };

  const handleCreateAlert = async () => {
    if (selectedReport) {
      try {
        // Create area polygon from incident point with configurable buffer
        const [lng, lat] = selectedReport.location.coordinates;
        // Convert meters to degrees (approximate)
        const buffer = alertBuffer / 111000; // ~111km per degree
        const area = {
          type: 'Polygon' as const,
          coordinates: [
            [
              [lng - buffer, lat - buffer],
              [lng + buffer, lat - buffer],
              [lng + buffer, lat + buffer],
              [lng - buffer, lat + buffer],
              [lng - buffer, lat - buffer],
            ],
          ],
        };

        // Create alert with incident link
        await createAlertMutation.mutateAsync({
          level: alertLevel,
          type: alertType,
          title: `Cảnh báo: ${IncidentTypeLabels[selectedReport.type]}`,
          message: alertMessage,
          area,
          incidentId: selectedReport.id,
        });

        // Update incident status to VERIFIED with note
        await updateStatusMutation.mutateAsync({
          id: selectedReport.id,
          data: {
            status: IncidentStatus.VERIFIED,
            notes: `Đã tạo cảnh báo (bán kính ${alertBuffer}m): ${alertMessage}`,
          },
        });

        handleCloseDialogs();
      } catch (error) {
        console.error('Failed to create alert:', error);
      }
    }
  };

  const handleStartProgress = async (reportId: string, notes?: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: reportId,
        data: {
          status: IncidentStatus.IN_PROGRESS,
          notes: notes || 'Đang tiến hành xử lý sự cố',
        },
      });
      setSelectedReport(null);
    } catch (error) {
      console.error('Failed to start progress:', error);
    }
  };

  const handleMarkResolved = async (reportId: string, notes?: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: reportId,
        data: {
          status: IncidentStatus.RESOLVED,
          notes: notes || 'Sự cố đã được giải quyết',
        },
      });
      setSelectedReport(null);
    } catch (error) {
      console.error('Failed to mark as resolved:', error);
    }
  };

  const handleCloseDialogs = () => {
    setSelectedReport(null);
    setShowCreateAlert(false);
    setAlertMessage('');
    setAlertLevel(AlertLevel.HIGH);
    setAlertType(AlertType.DISASTER);
    setAlertBuffer(500);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStatusFilterChange = (status?: IncidentStatus) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleTypeFilterChange = (type?: IncidentType) => {
    setTypeFilter(type);
    setPage(1);
  };

  const handleDateRangeChange = (start?: string, end?: string) => {
    setStartDate(start);
    setEndDate(end);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <ReportHeader startDate={startDate} endDate={endDate} />

      {/* View Toggle */}
      <Tabs
        value={activeView}
        onValueChange={(v) => setActiveView(v as 'map' | 'list' | 'dashboard')}
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
        </TabsList>

        <TabsContent value="map" className="mt-6">
          <IncidentsMapView
            incidents={mapIncidentsData?.data ?? []}
            isLoading={isLoadingMapIncidents}
            onSelectIncident={handleSelectReport}
          />
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <ReportTabs
            reports={incidentsData?.data ?? []}
            onSelectReport={handleSelectReport}
            isLoading={isLoadingIncidents}
            page={page}
            limit={PAGE_SIZE}
            total={incidentsData?.total ?? 0}
            onPageChange={handlePageChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            statusCounts={statusCounts}
            typeFilter={typeFilter}
            onTypeFilterChange={handleTypeFilterChange}
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={handleDateRangeChange}
          />
        </TabsContent>

        <TabsContent value="dashboard" className="mt-6">
          <IncidentStatsDashboard />
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <ReportDetailsDialog
        report={selectedReport}
        open={!!selectedReport && !showCreateAlert}
        onClose={handleCloseDialogs}
        onApprove={handleApprove}
        onReject={handleReject}
        onCreateAlert={handleOpenCreateAlert}
        onStartProgress={handleStartProgress}
        onMarkResolved={handleMarkResolved}
        isUpdating={updateStatusMutation.isPending}
      />

      {/* Create Alert Dialog */}
      <CreateAlertDialog
        report={selectedReport}
        open={showCreateAlert}
        message={alertMessage}
        onMessageChange={setAlertMessage}
        alertLevel={alertLevel}
        onAlertLevelChange={setAlertLevel}
        alertType={alertType}
        onAlertTypeChange={setAlertType}
        bufferMeters={alertBuffer}
        onBufferChange={setAlertBuffer}
        onClose={handleCloseDialogs}
        onCreate={handleCreateAlert}
        isCreating={createAlertMutation.isPending}
      />
    </div>
  );
}
