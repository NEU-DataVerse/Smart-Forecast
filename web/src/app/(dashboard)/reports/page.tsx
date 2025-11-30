'use client';

import { useState, useMemo } from 'react';
import { IIncident, IncidentStatus } from '@smart-forecast/shared';
import {
  useIncidents,
  useIncidentStatsByStatus,
  useUpdateIncidentStatus,
} from '@/hooks/useIncidentQuery';
import { ReportHeader } from '@/components/reportsUI/report-header';
import { ReportTabs } from '@/components/reportsUI/report-tabs';
import { ReportDetailsDialog } from '@/components/reportsUI/report-details-dialog';
import { CreateAlertDialog } from '@/components/reportsUI/create-alert-dialog';
import { IncidentStatsDashboard } from '@/components/reportsUI/incident-stats-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, List } from 'lucide-react';

const PAGE_SIZE = 10;

export default function ReportsPage() {
  // View state
  const [activeView, setActiveView] = useState<'list' | 'dashboard'>('list');

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | undefined>(undefined);

  // Dialog state
  const [selectedReport, setSelectedReport] = useState<IIncident | null>(null);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // API queries
  const { data: incidentsData, isLoading: isLoadingIncidents } = useIncidents({
    page,
    limit: PAGE_SIZE,
    status: statusFilter,
  });

  const { data: statusStats } = useIncidentStatsByStatus({ enablePolling: true });

  // Mutation
  const updateStatusMutation = useUpdateIncidentStatus();

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
      if (stat.status in counts) {
        counts[stat.status as IncidentStatus] = stat.count;
        counts.all += stat.count;
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
    setShowCreateAlert(true);
  };

  const handleCreateAlert = async () => {
    if (selectedReport) {
      // First approve the report
      await handleApprove(selectedReport.id, `Đã tạo cảnh báo: ${alertMessage}`);
      // TODO: Actually create alert using alert API
    }
    setShowCreateAlert(false);
    setAlertMessage('');
    setSelectedReport(null);
  };

  const handleCloseDialogs = () => {
    setSelectedReport(null);
    setShowCreateAlert(false);
    setAlertMessage('');
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStatusFilterChange = (status?: IncidentStatus) => {
    setStatusFilter(status);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <ReportHeader />

      {/* View Toggle */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as 'list' | 'dashboard')}>
        <TabsList>
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            Danh sách
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Thống kê
          </TabsTrigger>
        </TabsList>

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
        isUpdating={updateStatusMutation.isPending}
      />

      {/* Create Alert Dialog */}
      <CreateAlertDialog
        report={selectedReport}
        open={showCreateAlert}
        message={alertMessage}
        onMessageChange={setAlertMessage}
        onClose={handleCloseDialogs}
        onCreate={handleCreateAlert}
      />
    </div>
  );
}
