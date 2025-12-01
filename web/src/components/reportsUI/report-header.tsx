'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { incidentKeys } from '@/hooks/useIncidentQuery';
import { ExportReportButton } from './export-report-button';
import { ExportReportDialog } from './export-report-dialog';
import { ReportType } from '@/types/dto/report.dto';
import { useUserContext } from '@/context/userContext';
import { UserRole } from '@smart-forecast/shared';

interface ReportHeaderProps {
  /** Optional date range to pass to export */
  startDate?: string;
  endDate?: string;
}

export function ReportHeader({ startDate, endDate }: ReportHeaderProps) {
  const queryClient = useQueryClient();
  const { user } = useUserContext();
  const isAdmin = user?.role === UserRole.ADMIN;

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: incidentKeys.all });
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Báo cáo sự cố</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Quản lý báo cáo từ người dùng mobile app
        </p>
      </div>
      <div className="flex items-center gap-2">
        {isAdmin && (
          <>
            <ExportReportButton
              reportType={ReportType.INCIDENTS}
              exportParams={{ startDate, endDate }}
            />
            <ExportReportDialog
              reportType={ReportType.INCIDENTS}
              showDateRange={true}
              showStationFilter={false}
              defaultStartDate={startDate}
              defaultEndDate={endDate}
              trigger={
                <Button variant="secondary" size="sm">
                  Xuất nâng cao
                </Button>
              }
            />
          </>
        )}
        <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Làm mới
        </Button>
      </div>
    </div>
  );
}
