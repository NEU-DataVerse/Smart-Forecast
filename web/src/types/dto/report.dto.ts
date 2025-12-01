/**
 * Report Export DTOs
 */

export enum ExportFormat {
  PDF = 'pdf',
  CSV = 'csv',
}

export enum ReportType {
  WEATHER = 'weather',
  AIR_QUALITY = 'air-quality',
  INCIDENTS = 'incidents',
  STATIONS = 'stations',
}

/**
 * Report type labels for UI display
 */
export const ReportTypeLabels: Record<ReportType, string> = {
  [ReportType.WEATHER]: 'Thời tiết',
  [ReportType.AIR_QUALITY]: 'Chất lượng không khí',
  [ReportType.INCIDENTS]: 'Sự cố',
  [ReportType.STATIONS]: 'Trạm quan trắc',
};

/**
 * Export format labels for UI display
 */
export const ExportFormatLabels: Record<ExportFormat, string> = {
  [ExportFormat.PDF]: 'PDF',
  [ExportFormat.CSV]: 'CSV',
};

/**
 * Default and maximum limits for report exports
 */
export const REPORT_LIMITS = {
  DEFAULT: 1000,
  MAX: 10000,
  PDF_MAX_DISPLAY: 50,
  PDF_INCIDENTS_MAX_DISPLAY: 30,
} as const;

/**
 * Base export query parameters
 */
export interface BaseExportParams {
  format?: ExportFormat;
  limit?: number;
}

/**
 * Export query parameters for Weather and Air Quality reports
 * Supports date range filtering and station filtering
 */
export interface ExportQueryParams extends BaseExportParams {
  startDate?: string;
  endDate?: string;
  stationId?: string;
}

/**
 * Export query parameters for Incidents reports
 * Supports date range filtering only (no stationId)
 */
export interface IncidentExportParams extends BaseExportParams {
  startDate?: string;
  endDate?: string;
}

/**
 * Export query parameters for Stations reports
 * Only supports format selection (no date range, no stationId)
 */
export interface StationExportParams extends BaseExportParams {
  // Inherits format and limit from BaseExportParams
  // No additional fields needed for station reports
  _placeholder?: never;
}

/**
 * Export request payload for hook
 */
export interface ExportRequest {
  type: ReportType;
  params: ExportQueryParams | IncidentExportParams | StationExportParams;
}
