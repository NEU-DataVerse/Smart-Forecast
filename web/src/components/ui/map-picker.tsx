'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (lat: number, lng: number) => void;
  height?: string;
  zoom?: number;
}

/**
 * MapPicker Component
 * Interactive map using Goong tiles with Maplibre GL
 * Features: Click to select location, draggable marker
 */
export function MapPicker({
  initialLat = 21.028511,
  initialLng = 105.804817,
  onLocationSelect,
  height = '400px',
  zoom = 13,
}: MapPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Use OSM tiles (free, reliable, no API key needed)
    // Goong API key can be used for geocoding/reverse geocoding later
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

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [initialLng, initialLat],
      zoom: zoom,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Create draggable marker
    marker.current = new maplibregl.Marker({
      draggable: true,
      color: '#3b82f6',
    })
      .setLngLat([initialLng, initialLat])
      .addTo(map.current);

    // Handle marker drag end
    marker.current.on('dragend', () => {
      if (marker.current) {
        const lngLat = marker.current.getLngLat();
        onLocationSelect(lngLat.lat, lngLat.lng);
      }
    });

    // Handle map click to move marker
    map.current.on('click', (e) => {
      if (marker.current) {
        marker.current.setLngLat([e.lngLat.lng, e.lngLat.lat]);
        onLocationSelect(e.lngLat.lat, e.lngLat.lng);
      }
    });

    map.current.on('load', () => {
      setIsLoaded(true);
    });

    // Cleanup
    return () => {
      if (marker.current) {
        marker.current.remove();
      }
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Update marker position when initialLat/initialLng changes
  useEffect(() => {
    if (map.current && marker.current && isLoaded) {
      marker.current.setLngLat([initialLng, initialLat]);
      map.current.flyTo({
        center: [initialLng, initialLat],
        zoom: zoom,
        duration: 1000,
      });
    }
  }, [initialLat, initialLng, isLoaded, zoom]);

  return (
    <div className="relative">
      <div
        ref={mapContainer}
        style={{ height }}
        className="w-full rounded-lg border border-slate-200 overflow-hidden"
      />
      <div className="absolute bottom-2 left-2 bg-white px-3 py-1.5 rounded-md shadow-sm text-xs text-slate-600 border border-slate-200">
        Click map or drag marker to select location
      </div>
    </div>
  );
}
