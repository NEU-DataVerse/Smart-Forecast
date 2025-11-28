'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { AirQualityDataResponse } from '@/types/dto/air-quality.dto';

interface AQIMapViewProps {
  data: AirQualityDataResponse[];
  selectedStationId?: string | null;
  onStationSelect: (stationId: string) => void;
  height?: string;
}

function getAQIMarkerColor(aqi: number): string {
  if (aqi <= 50) return '#10b981'; // green
  if (aqi <= 100) return '#eab308'; // yellow
  if (aqi <= 150) return '#f97316'; // orange
  if (aqi <= 200) return '#ef4444'; // red
  if (aqi <= 300) return '#a855f7'; // purple
  return '#7f1d1d'; // maroon
}

function createAQIMarkerElement(aqi: number, isSelected: boolean): HTMLElement {
  const el = document.createElement('div');
  el.className = 'aqi-marker';

  // Set base styles
  el.style.width = isSelected ? '50px' : '44px';
  el.style.height = isSelected ? '50px' : '44px';
  el.style.borderRadius = '50%';
  el.style.backgroundColor = getAQIMarkerColor(aqi);
  el.style.border = isSelected ? '4px solid #fff' : '3px solid #fff';
  el.style.boxShadow = isSelected ? '0 4px 12px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.3)';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.fontWeight = 'bold';
  el.style.fontSize = isSelected ? '16px' : '14px';
  el.style.color = 'white';
  el.style.cursor = 'pointer';
  el.style.transition = 'all 0.2s ease';
  el.style.zIndex = isSelected ? '10' : '1';

  el.textContent = aqi.toString();

  // Hover effect using box-shadow instead of scale to avoid position jump
  el.addEventListener('mouseenter', () => {
    el.style.boxShadow = '0 6px 16px rgba(0,0,0,0.5)';
    el.style.filter = 'brightness(1.1)';
    el.style.zIndex = '100';
  });
  el.addEventListener('mouseleave', () => {
    el.style.boxShadow = isSelected ? '0 4px 12px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.3)';
    el.style.filter = 'brightness(1)';
    el.style.zIndex = isSelected ? '10' : '1';
  });

  return el;
}

export function AQIMapView({
  data,
  selectedStationId,
  onStationSelect,
  height = '500px',
}: AQIMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<Map<string, maplibregl.Marker>>(new Map());

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const mapStyle = {
      version: 8 as const,
      sources: {
        osm: {
          type: 'raster' as const,
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors',
        },
      },
      layers: [
        {
          id: 'osm',
          type: 'raster' as const,
          source: 'osm',
        },
      ],
    };

    // Default center: Hanoi, Vietnam
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [105.8342, 21.0278], // Hanoi
      zoom: 11,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => {
      markers.current.forEach((marker) => marker.remove());
      markers.current.clear();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when data or selection changes
  useEffect(() => {
    if (!map.current || !data || data.length === 0) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current.clear();

    // Calculate bounds for all stations
    const bounds = new maplibregl.LngLatBounds();

    // Add markers for each station
    data.forEach((station) => {
      const aqi = station.aqi.epaUS.index;
      const isSelected = station.stationId === selectedStationId;

      const el = createAQIMarkerElement(aqi, isSelected);

      // Add click handler
      el.addEventListener('click', () => {
        onStationSelect(station.stationId);
      });

      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'center',
      })
        .setLngLat([station.location.lon, station.location.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${station.address || 'Station'}</div>
              <div style="font-size: 12px; color: #64748b;">
                AQI: <span style="font-weight: 600; color: ${getAQIMarkerColor(aqi)};">${aqi}</span>
                (${station.aqi.epaUS.level})
              </div>
            </div>
          `),
        )
        .addTo(map.current!);

      markers.current.set(station.stationId, marker);
      bounds.extend([station.location.lon, station.location.lat]);
    });

    // Fit map to show all markers
    if (data.length > 0 && !selectedStationId) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 13,
        duration: 1000,
      });
    }
  }, [data, selectedStationId, onStationSelect]);

  // Fly to selected station
  useEffect(() => {
    if (!map.current || !selectedStationId) return;

    const station = data.find((s) => s.stationId === selectedStationId);
    if (station) {
      map.current.flyTo({
        center: [station.location.lon, station.location.lat],
        zoom: 14,
        duration: 1000,
      });

      // Show popup for selected marker
      const marker = markers.current.get(selectedStationId);
      if (marker) {
        marker.togglePopup();
      }
    }
  }, [selectedStationId, data]);

  return (
    <div className="relative">
      <div
        ref={mapContainer}
        style={{ height }}
        className="w-full rounded-lg border border-slate-200 overflow-hidden"
      />
      {data.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200">
          <div className="text-xs font-semibold text-slate-700 mb-2">AQI Scale</div>
          <div className="space-y-1">
            {[
              { range: '0-50', color: '#10b981', label: 'Good' },
              { range: '51-100', color: '#eab308', label: 'Moderate' },
              { range: '101-150', color: '#f97316', label: 'Unhealthy (SG)' },
              { range: '151-200', color: '#ef4444', label: 'Unhealthy' },
              { range: '201-300', color: '#a855f7', label: 'Very Unhealthy' },
              { range: '300+', color: '#7f1d1d', label: 'Hazardous' },
            ].map((item) => (
              <div key={item.range} className="flex items-center gap-2 text-xs">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600">
                  {item.range}: {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200">
        <div className="text-sm font-semibold text-slate-700">
          {data.length} Station{data.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
