/**
 * Map Layer Optimization Utilities
 *
 * Provides utilities to optimize MapLibre layer rendering and sensor styling
 */

/**
 * Sensor layer configuration
 */
export const SENSOR_LAYER_CONFIG = {
  CLUSTERING: {
    enabled: true,
    radius: 50,
    maxZoom: 14,
    minPoints: 2,
  },

  MARKER: {
    size: 40,
    borderWidth: 2,
    borderColor: '#007AFF',
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    shadowOffset: { width: 0, height: 2 },
  },

  STATUS_COLORS: {
    active: '#34C759',
    inactive: '#FF3B30',
    unknown: '#FF9500',
  },

  AQI_COLORS: {
    good: '#34C759',
    moderate: '#FFCC00',
    unhealthy_for_groups: '#FF9500',
    unhealthy: '#FF3B30',
    very_unhealthy: '#8B0000',
    hazardous: '#4B0082',
  },
};

/**
 * Get AQI color based on AQI value
 */
export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return SENSOR_LAYER_CONFIG.AQI_COLORS.good;
  if (aqi <= 100) return SENSOR_LAYER_CONFIG.AQI_COLORS.moderate;
  if (aqi <= 150) return SENSOR_LAYER_CONFIG.AQI_COLORS.unhealthy_for_groups;
  if (aqi <= 200) return SENSOR_LAYER_CONFIG.AQI_COLORS.unhealthy;
  if (aqi <= 300) return SENSOR_LAYER_CONFIG.AQI_COLORS.very_unhealthy;
  return SENSOR_LAYER_CONFIG.AQI_COLORS.hazardous;
}

/**
 * Get status color based on sensor status
 */
export function getStatusColor(status: string): string {
  const statusLower = status.toLowerCase();
  return (
    SENSOR_LAYER_CONFIG.STATUS_COLORS[
      statusLower as keyof typeof SENSOR_LAYER_CONFIG.STATUS_COLORS
    ] || SENSOR_LAYER_CONFIG.STATUS_COLORS.unknown
  );
}
