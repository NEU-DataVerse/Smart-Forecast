/**
 * Custom Hook: useSensorMarkers
 *
 * Manages sensor marker rendering with AQI/status-based coloring
 */

import { useCallback, useState, useRef, useEffect } from 'react';
import { getAQIColor, getStatusColor, SENSOR_LAYER_CONFIG } from '@/utils/mapLayerOptimization';

interface SensorMarkerData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive' | 'unknown';
  aqi?: number;
  temperature?: number;
  humidity?: number;
  type: string;
  lastReading: {
    aqi?: number;
    temperature?: number;
    humidity?: number;
  };
}

export function useSensorMarkers(sensors: SensorMarkerData[] = []) {
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const markerCacheRef = useRef<Map<string, string>>(new Map());

  const getMarkerColor = useCallback((sensor: SensorMarkerData): string => {
    if (markerCacheRef.current.has(sensor.id)) {
      return markerCacheRef.current.get(sensor.id)!;
    }

    let color: string;
    if (sensor.aqi !== undefined && sensor.aqi >= 0) {
      color = getAQIColor(sensor.aqi);
    } else if (sensor.lastReading?.aqi !== undefined && sensor.lastReading.aqi >= 0) {
      color = getAQIColor(sensor.lastReading.aqi);
    } else {
      color = getStatusColor(sensor.status);
    }

    markerCacheRef.current.set(sensor.id, color);
    return color;
  }, []);

  const getMarkerStyle = useCallback(
    (sensor: SensorMarkerData) => ({
      width: SENSOR_LAYER_CONFIG.MARKER.size,
      height: SENSOR_LAYER_CONFIG.MARKER.size,
      borderRadius: SENSOR_LAYER_CONFIG.MARKER.size / 2,
      backgroundColor: SENSOR_LAYER_CONFIG.MARKER.backgroundColor,
      borderWidth: SENSOR_LAYER_CONFIG.MARKER.borderWidth,
      borderColor: getMarkerColor(sensor),
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      shadowColor: '#000',
      shadowOffset: SENSOR_LAYER_CONFIG.MARKER.shadowOffset,
      shadowOpacity: SENSOR_LAYER_CONFIG.MARKER.shadowOpacity,
      shadowRadius: SENSOR_LAYER_CONFIG.MARKER.shadowRadius,
      elevation: 5,
    }),
    [getMarkerColor],
  );

  const handleSensorSelect = useCallback((sensor: SensorMarkerData) => {
    setSelectedSensor(sensor.id);
  }, []);

  const handleSensorDeselect = useCallback(() => {
    setSelectedSensor(null);
  }, []);

  useEffect(() => {
    if (sensors.length === 0) {
      markerCacheRef.current.clear();
    }
  }, [sensors.length]);

  return {
    selectedSensor,
    setSelectedSensor,
    getMarkerColor,
    getMarkerStyle,
    handleSensorSelect,
    handleSensorDeselect,
  };
}
