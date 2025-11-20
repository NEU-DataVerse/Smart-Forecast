import { AlertLevel, AlertType } from '../constants';
import { GeoPolygon } from './geojson.types';

/**
 * Alert entity
 */
export interface IAlert {
  id: string;
  level: AlertLevel;
  type: AlertType;
  title: string;
  message: string;
  area?: GeoPolygon; // Affected geographic area
  sentAt: Date;
  expiresAt?: Date; // Alert expiration time
  sentCount?: number; // Number of users notified
  createdBy: string; // Admin user id
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create alert request
 */
export interface ICreateAlertRequest {
  level: AlertLevel;
  type: AlertType;
  title: string;
  message: string;
  area?: GeoPolygon;
  expiresAt?: Date;
}

/**
 * Alert query filters
 */
export interface IAlertQueryParams {
  page?: number;
  limit?: number;
  level?: AlertLevel;
  type?: AlertType;
  startDate?: string;
  endDate?: string;
}

/**
 * Active alerts response (for citizens)
 */
export interface IActiveAlert {
  id: string;
  level: AlertLevel;
  type: AlertType;
  title: string;
  message: string;
  sentAt: Date;
  expiresAt?: Date;
}
