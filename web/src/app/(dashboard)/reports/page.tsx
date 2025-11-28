'use client';

import { useState } from 'react';
import { recentReports } from '@/services/data/report.api';
import { IIncident } from '@/../../shared/src/types/incident.types';
import { IncidentStatus } from '@/../../shared/src/constants';
import { ReportHeader } from '@/components/reportsUI/report-header';
import { ReportTabs } from '@/components/reportsUI/report-tabs';
import { ReportDetailsDialog } from '@/components/reportsUI/report-details-dialog';
import { CreateAlertDialog } from '@/components/reportsUI/create-alert-dialog';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<IIncident | null>(null);
  const [reports, setReports] = useState(recentReports);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSelectReport = (report: IIncident) => {
    setSelectedReport(report);
    setShowCreateAlert(false);
  };

  const handleApprove = (reportId: string) => {
    setReports(
      reports.map((r) =>
        r.id === reportId
          ? { ...r, status: IncidentStatus.VERIFIED, verifiedBy: 'admin-current' }
          : r,
      ),
    );
    setSelectedReport(null);
  };

  const handleReject = (reportId: string) => {
    setReports(
      reports.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: IncidentStatus.REJECTED,
              verifiedBy: 'admin-current',
              adminNotes: 'Báo cáo không hợp lệ',
            }
          : r,
      ),
    );
    setSelectedReport(null);
  };

  const handleOpenCreateAlert = () => {
    setShowCreateAlert(true);
  };

  const handleCreateAlert = () => {
    if (selectedReport) {
      handleApprove(selectedReport.id);
    }
    setShowCreateAlert(false);
    setAlertMessage('');
    setSelectedReport(null);
  };

  const handleCloseDialogs = () => {
    setSelectedReport(null);
    setShowCreateAlert(false);
  };

  return (
    <div className="space-y-6">
      <ReportHeader />
      <ReportTabs reports={reports} onSelectReport={handleSelectReport} />

      <ReportDetailsDialog
        report={selectedReport}
        open={!!selectedReport && !showCreateAlert}
        onClose={handleCloseDialogs}
        onApprove={handleApprove}
        onReject={handleReject}
        onCreateAlert={handleOpenCreateAlert}
      />

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
