import { AlertLevel, AlertType, AlertMetric, ThresholdOperator } from '../constants';
import { GeoPolygon, GeoPoint } from './geojson.types';

/**
 * Alert entity
 */
export interface IAlert {
  id: string;
  level: AlertLevel;
  type: AlertType;
  title: string;
  message: string;
  advice?: string; // Recommendations for users
  area?: GeoPolygon; // Affected geographic area
  sentAt: Date;
  expiresAt?: Date; // Alert expiration time
  sentCount?: number; // Number of users notified
  isAutomatic: boolean; // Whether alert was auto-generated
  sourceData?: Record<string, unknown>; // Raw data that triggered alert
  stationId?: string; // Related station
  createdBy?: string; // Admin user id (null for auto alerts)
  incidentId?: string; // Related incident (when alert created from incident report)
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
  advice?: string;
  area?: GeoPolygon;
  expiresAt?: Date;
  incidentId?: string; // Link alert to incident report
}

/**
 * Alert query filters
 */
export interface IAlertQueryParams {
  page?: number;
  limit?: number;
  level?: AlertLevel;
  type?: AlertType;
  isAutomatic?: boolean;
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
  advice?: string;
  sentAt: Date;
  expiresAt?: Date;
}

/**
 * Alert threshold configuration
 */
export interface IAlertThreshold {
  id: string;
  type: AlertType;
  metric: AlertMetric;
  operator: ThresholdOperator;
  value: number;
  level: AlertLevel;
  adviceTemplate: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create alert threshold request
 */
export interface ICreateAlertThresholdRequest {
  type: AlertType;
  metric: AlertMetric;
  operator: ThresholdOperator;
  value: number;
  level: AlertLevel;
  adviceTemplate: string;
  isActive?: boolean;
}

/**
 * Update alert threshold request
 */
export interface IUpdateAlertThresholdRequest {
  type?: AlertType;
  metric?: AlertMetric;
  operator?: ThresholdOperator;
  value?: number;
  level?: AlertLevel;
  adviceTemplate?: string;
  isActive?: boolean;
}

/**
 * User location update request
 */
export interface IUpdateUserLocationRequest {
  latitude: number;
  longitude: number;
}
