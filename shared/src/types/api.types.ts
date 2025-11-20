import { ApiStatus } from '../constants';

/**
 * Generic API Response wrapper
 */
export interface IApiResponse<T = any> {
  status: ApiStatus;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Paginated response
 */
export interface IPaginatedResponse<T = any> {
  data: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}

/**
 * Pagination query parameters
 */
export interface IPaginationParams {
  page?: number;
  limit?: number;
}

/**
 * File upload response
 */
export interface IFileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

/**
 * Data ingestion response
 */
export interface IIngestionResponse {
  status: ApiStatus;
  message: string;
  entitiesIngested?: number;
  errors?: string[];
}

/**
 * Overview statistics for dashboard
 */
export interface IOverviewStats {
  totalIncidents: number;
  pendingIncidents: number;
  activeAlerts: number;
  avgAqiToday?: number;
  totalCitizens?: number;
}

/**
 * Chart data structure
 */
export interface IChartData {
  labels: string[];
  datasets: IChartDataset[];
}

/**
 * Chart dataset
 */
export interface IChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
}

/**
 * Date range filter
 */
export interface IDateRangeFilter {
  startDate?: string | Date;
  endDate?: string | Date;
}

/**
 * Error response
 */
export interface IErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
  path?: string;
}
