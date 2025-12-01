'use client';

import { useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import type { GeoPolygon, AlertLevel } from '@smart-forecast/shared';

import 'leaflet/dist/leaflet.css';

// Override Leaflet z-index
const leafletZIndexStyle = `
  .alert-preview-map .leaflet-pane,
  .alert-preview-map .leaflet-top,
  .alert-preview-map .leaflet-bottom,
  .alert-preview-map .leaflet-control {
    z-index: auto !important;
  }
  .alert-preview-map .leaflet-map-pane { z-index: 1 !important; }
  .alert-preview-map .leaflet-tile-pane { z-index: 2 !important; }
  .alert-preview-map .leaflet-overlay-pane { z-index: 4 !important; }
  .alert-preview-map .leaflet-control { z-index: 10 !important; }
`;

// Colors for different alert levels
const ALERT_LEVEL_COLORS: Record<AlertLevel, string> = {
  LOW: '#22c55e',
  MEDIUM: '#f59e0b',
  HIGH: '#f97316',
  CRITICAL: '#ef4444',
};

interface AlertAreaPreviewProps {
  area: GeoPolygon;
  level: AlertLevel;
  height?: string;
}

// Component to fit bounds to polygon
function FitToPolygon({ area }: { area: GeoPolygon }) {
  const map = useMap();

  useMemo(() => {
    if (area && area.coordinates && area.coordinates[0]) {
      const bounds = L.latLngBounds([]);
      area.coordinates[0].forEach((coord: number[]) => {
        // GeoJSON is [lng, lat], Leaflet is [lat, lng]
        bounds.extend([coord[1], coord[0]]);
      });
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
      }
    }
  }, [area, map]);

  return null;
}

export function AlertAreaPreviewComponent({
  area,
  level,
  height = '250px',
}: AlertAreaPreviewProps) {
  const color = ALERT_LEVEL_COLORS[level] || '#3b82f6';

  // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
  const positions = useMemo(() => {
    if (!area || !area.coordinates || !area.coordinates[0]) {
      return [];
    }
    return area.coordinates[0].map((coord: number[]) => [coord[1], coord[0]] as [number, number]);
  }, [area]);

  if (positions.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500"
        style={{ height }}
      >
        Không có dữ liệu vùng ảnh hưởng
      </div>
    );
  }

  return (
    <div className="alert-preview-map relative" style={{ height }}>
      <style dangerouslySetInnerHTML={{ __html: leafletZIndexStyle }} />
      <MapContainer
        center={[21.0285, 105.8542]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
        scrollWheelZoom={false}
        dragging={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polygon
          positions={positions}
          pathOptions={{
            color: color,
            fillColor: color,
            fillOpacity: 0.3,
            weight: 3,
          }}
        />
        <FitToPolygon area={area} />
      </MapContainer>
    </div>
  );
}
