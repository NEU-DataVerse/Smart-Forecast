'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { reportService } from '@/services/api/report.service';
import {
  ReportType,
  ReportTypeLabels,
  ExportFormat,
  type ExportQueryParams,
  type IncidentExportParams,
  type StationExportParams,
  type ExportRequest,
} from '@/types/dto/report.dto';

/**
 * Hook for exporting reports with loading state and notifications
 */
export function useReportExport() {
  return useMutation({
    mutationFn: async (request: ExportRequest) => {
      const { type, params } = request;

      switch (type) {
        case ReportType.WEATHER:
          return reportService.exportWeather(params as ExportQueryParams);
        case ReportType.AIR_QUALITY:
          return reportService.exportAirQuality(params as ExportQueryParams);
        case ReportType.INCIDENTS:
          return reportService.exportIncidents(params as IncidentExportParams);
        case ReportType.STATIONS:
          return reportService.exportStations(params as StationExportParams);
        default:
          throw new Error(`Unknown report type: ${type}`);
      }
    },
    onSuccess: (_, variables) => {
      const reportLabel = ReportTypeLabels[variables.type];
      const formatLabel = variables.params.format === ExportFormat.CSV ? 'CSV' : 'PDF';
      toast.success(`Xuất báo cáo ${reportLabel} (${formatLabel}) thành công!`);
    },
    onError: (error, variables) => {
      const reportLabel = ReportTypeLabels[variables.type];
      console.error(`Failed to export ${variables.type} report:`, error);
      toast.error(`Xuất báo cáo ${reportLabel} thất bại. Vui lòng thử lại.`);
    },
  });
}

/**
 * Convenience hooks for specific report types
 */
export function useExportWeather() {
  const mutation = useReportExport();

  return {
    ...mutation,
    exportWeather: (params: ExportQueryParams = {}) =>
      mutation.mutateAsync({ type: ReportType.WEATHER, params }),
  };
}

export function useExportAirQuality() {
  const mutation = useReportExport();

  return {
    ...mutation,
    exportAirQuality: (params: ExportQueryParams = {}) =>
      mutation.mutateAsync({ type: ReportType.AIR_QUALITY, params }),
  };
}

export function useExportIncidents() {
  const mutation = useReportExport();

  return {
    ...mutation,
    exportIncidents: (params: IncidentExportParams = {}) =>
      mutation.mutateAsync({ type: ReportType.INCIDENTS, params }),
  };
}

export function useExportStations() {
  const mutation = useReportExport();

  return {
    ...mutation,
    exportStations: (params: StationExportParams = {}) =>
      mutation.mutateAsync({ type: ReportType.STATIONS, params }),
  };
}
