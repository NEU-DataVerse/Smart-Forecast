import { IncidentType, IncidentStatus } from '../constants';
import { GeoPoint } from './geojson.types';

/**
 * Incident report entity
 */
export interface IIncident {
  id: string;
  type: IncidentType;
  description: string;
  location: GeoPoint;
  imageUrls: string[]; // URLs to images in MinIO
  status: IncidentStatus;
  reportedBy: string; // User id
  verifiedBy?: string; // Admin user id
  adminNotes?: string; // Admin notes when verifying/rejecting
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create incident request
 */
export interface ICreateIncidentRequest {
  type: IncidentType;
  description: string;
  location: GeoPoint;
  imageUrls: string[];
}

/**
 * Update incident status request (Admin only)
 */
export interface IUpdateIncidentStatusRequest {
  status: IncidentStatus;
  notes?: string;
}

/**
 * Incident query filters
 */
export interface IIncidentQueryParams {
  page?: number;
  limit?: number;
  status?: IncidentStatus;
  type?: IncidentType;
  startDate?: string;
  endDate?: string;
  reportedBy?: string;
}

/**
 * Incident detail with reporter info
 */
export interface IIncidentDetail extends IIncident {
  reporter?: {
    id: string;
    fullName: string;
    email: string;
  };
  verifier?: {
    id: string;
    fullName: string;
    email: string;
  };
}

/**
 * Active incident (verified incidents for map display)
 */
export interface IActiveIncident {
  id: string;
  type: IncidentType;
  location: GeoPoint;
  description: string;
  imageUrls: string[];
  createdAt: Date;
}

/**
 * Incident summary for statistics
 */
export interface IIncidentSummary {
  type: IncidentType;
  count: number;
}
