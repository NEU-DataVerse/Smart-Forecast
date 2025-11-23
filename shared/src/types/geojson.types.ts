/**
 * GeoJSON types for location data
 * Based on RFC 7946 GeoJSON specification
 */

/**
 * GeoJSON Point geometry
 * coordinates: [longitude, latitude] (and optionally altitude)
 */
export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number] | [number, number, number];
}

/**
 * GeoJSON Polygon geometry
 */
export interface GeoPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

/**
 * GeoJSON LineString geometry
 */
export interface GeoLineString {
  type: 'LineString';
  coordinates: number[][];
}

/**
 * Union type for all supported GeoJSON geometries
 */
export type GeoGeometry = GeoPoint | GeoPolygon | GeoLineString;

/**
 * Simple coordinate pair [longitude, latitude]
 */
export interface Coordinates {
  longitude: number;
  latitude: number;
}

/**
 * Location with optional address information
 */
export interface Location {
  coordinates: Coordinates;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
}
