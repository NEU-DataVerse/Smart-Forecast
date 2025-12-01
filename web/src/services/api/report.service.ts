/**
 * Report Export API Service
 * Handles exporting reports in PDF/CSV format
 */

import { ApiClient } from '@/services/axios';
import {
  ExportFormat,
  type ExportQueryParams,
  type IncidentExportParams,
  type StationExportParams,
} from '@/types/dto/report.dto';

const BASE_PATH = '/reports';

/**
 * Helper to generate filename with date suffix
 */
function generateFilename(prefix: string, format: ExportFormat): string {
  const dateStr = new Date().toISOString().split('T')[0];
  return `${prefix}-${dateStr}.${format}`;
}

/**
 * Helper to trigger file download from blob
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Generic export function
 */
async function exportReport(
  endpoint: string,
  params: ExportQueryParams | IncidentExportParams | StationExportParams,
  filenamePrefix: string,
): Promise<void> {
  const format = params.format || ExportFormat.PDF;

  const response = await ApiClient.get(`${BASE_PATH}/${endpoint}`, {
    params,
    responseType: 'blob',
  });

  const blob = new Blob([response.data], {
    type: format === ExportFormat.PDF ? 'application/pdf' : 'text/csv',
  });

  const filename = generateFilename(filenamePrefix, format);
  downloadBlob(blob, filename);
}

export const reportService = {
  /**
   * Export weather data report
   * @param params - Export parameters (format, dateRange, stationId, limit)
   */
  async exportWeather(params: ExportQueryParams = {}): Promise<void> {
    return exportReport('weather', params, 'weather-report');
  },

  /**
   * Export air quality data report
   * @param params - Export parameters (format, dateRange, stationId, limit)
   */
  async exportAirQuality(params: ExportQueryParams = {}): Promise<void> {
    return exportReport('air-quality', params, 'air-quality-report');
  },

  /**
   * Export incidents report
   * @param params - Export parameters (format, dateRange, limit)
   */
  async exportIncidents(params: IncidentExportParams = {}): Promise<void> {
    return exportReport('incidents', params, 'incidents-report');
  },

  /**
   * Export stations report
   * @param params - Export parameters (format, limit)
   */
  async exportStations(params: StationExportParams = {}): Promise<void> {
    return exportReport('stations', params, 'stations-report');
  },
};
