/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 NEU-DataVerse
 */

'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { WeatherDataResponse } from '@/types/dto/weather.dto';
import { buildTileLayerUrl, getLayerByCode } from '@/config/weather-layers';
import { WeatherLayerControl } from './WeatherLayerControl';

interface WeatherMapViewProps {
  data: WeatherDataResponse[];
  selectedStationId?: string | null;
  onStationSelect: (stationId: string) => void;
  height?: string;
  activeLayers?: string[];
  layerOpacity?: number;
  onLayerError?: (layerCode: string, error: Error) => void;
  onLayersChange?: (layers: string[]) => void;
  onOpacityChange?: (opacity: number) => void;
  failedLayers?: string[];
  onRetryLayer?: (layerCode: string) => void;
}

function getTemperatureColor(temp: number): string {
  if (temp <= 0) return '#3b82f6'; // blue - freezing
  if (temp <= 10) return '#06b6d4'; // cyan - cold
  if (temp <= 20) return '#22c55e'; // green - cool
  if (temp <= 25) return '#84cc16'; // lime - mild
  if (temp <= 30) return '#eab308'; // yellow - warm
  if (temp <= 35) return '#f97316'; // orange - hot
  return '#ef4444'; // red - very hot
}

function createWeatherMarkerElement(temp: number, isSelected: boolean): HTMLElement {
  const el = document.createElement('div');
  el.className = 'weather-marker';

  // Set base styles
  el.style.width = isSelected ? '50px' : '44px';
  el.style.height = isSelected ? '50px' : '44px';
  el.style.borderRadius = '50%';
  el.style.backgroundColor = getTemperatureColor(temp);
  el.style.border = isSelected ? '4px solid #fff' : '3px solid #fff';
  el.style.boxShadow = isSelected ? '0 4px 12px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.3)';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.fontWeight = 'bold';
  el.style.fontSize = isSelected ? '14px' : '12px';
  el.style.color = 'white';
  el.style.cursor = 'pointer';
  el.style.transition = 'all 0.2s ease';
  el.style.zIndex = isSelected ? '10' : '1';

  el.textContent = `${Math.round(temp)}°`;

  // Hover effect
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

export function WeatherMapView({
  data,
  selectedStationId,
  onStationSelect,
  height = '500px',
  activeLayers = [],
  layerOpacity = 0.6,
  onLayerError,
  onLayersChange,
  onOpacityChange,
  failedLayers = [],
  onRetryLayer,
}: WeatherMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<Map<string, maplibregl.Marker>>(new Map());
  const weatherLayerIds = useRef<Set<string>>(new Set());
  const layerControlContainer = useRef<HTMLDivElement | null>(null);
  const layerControlRoot = useRef<{
    render: (element: React.ReactElement) => void;
    unmount: () => void;
  } | null>(null);

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

    // Create custom control for layer panel (will be rendered via React)
    if (onLayersChange && onOpacityChange) {
      class LayerControl implements maplibregl.IControl {
        private _container: HTMLDivElement | undefined;

        onAdd() {
          this._container = document.createElement('div');
          this._container.className = 'maplibregl-ctrl';
          this._container.style.margin = '0';
          layerControlContainer.current = this._container;
          return this._container;
        }

        onRemove() {
          if (this._container?.parentNode) {
            this._container.parentNode.removeChild(this._container);
          }
          layerControlContainer.current = null;
        }
      }

      map.current.addControl(new LayerControl(), 'top-right');
    }

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add fullscreen control
    map.current.addControl(new maplibregl.FullscreenControl(), 'top-right');

    const currentMarkers = markers.current;
    const currentMap = map.current;
    const currentWeatherLayerIds = weatherLayerIds.current;
    return () => {
      currentMarkers.forEach((marker) => marker.remove());
      currentMarkers.clear();
      // Remove weather layers
      currentWeatherLayerIds.forEach((layerId) => {
        if (currentMap?.getLayer(layerId)) {
          currentMap.removeLayer(layerId);
        }
        if (currentMap?.getSource(layerId)) {
          currentMap.removeSource(layerId);
        }
      });
      currentWeatherLayerIds.clear();
      if (currentMap) {
        currentMap.remove();
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
      const temp = station.temperature.current ?? 0;
      const isSelected = station.stationId === selectedStationId;

      const el = createWeatherMarkerElement(temp, isSelected);

      // Add click handler
      el.addEventListener('click', () => {
        onStationSelect(station.stationId);
      });

      const humidity = (station.atmospheric?.humidity ?? 0) * 100;
      const wind = station.wind?.speed ?? 0;
      const pressure = station.atmospheric?.pressure ?? 0;

      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'center',
      })
        .setLngLat([station.location.lon, station.location.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px; min-width: 180px;">
              <div style="font-weight: 600; margin-bottom: 8px;">${station.address || 'Station'}</div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 12px;">
                <div style="color: #64748b;">Temperature:</div>
                <div style="font-weight: 600; color: ${getTemperatureColor(temp)};">${temp.toFixed(1)}°C</div>
                <div style="color: #64748b;">Humidity:</div>
                <div style="font-weight: 500;">${humidity.toFixed(0)}%</div>
                <div style="color: #64748b;">Wind:</div>
                <div style="font-weight: 500;">${wind.toFixed(1)} m/s</div>
                <div style="color: #64748b;">Pressure:</div>
                <div style="font-weight: 500;">${pressure.toFixed(0)} hPa</div>
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

  // Initialize layer control root once on mount
  useEffect(() => {
    const initializeLayerControl = async () => {
      if (!layerControlContainer.current) return;

      const { createRoot } = await import('react-dom/client');
      const container = layerControlContainer.current;
      if (!container || layerControlRoot.current) return;

      layerControlRoot.current = createRoot(container);
    };

    initializeLayerControl();
  }, []);

  // Update layer control render when props change
  useEffect(() => {
    if (!layerControlRoot.current || !onLayersChange || !onOpacityChange) return;

    layerControlRoot.current.render(
      <WeatherLayerControl
        activeLayers={activeLayers}
        onLayersChange={onLayersChange}
        opacity={layerOpacity}
        onOpacityChange={onOpacityChange}
        failedLayers={failedLayers}
        onRetryLayer={onRetryLayer}
      />,
    );
  }, [activeLayers, layerOpacity, failedLayers, onLayersChange, onOpacityChange, onRetryLayer]);

  // Cleanup layer control on unmount
  useEffect(() => {
    return () => {
      if (layerControlRoot.current) {
        setTimeout(() => {
          if (layerControlRoot.current) {
            layerControlRoot.current.unmount();
            layerControlRoot.current = null;
          }
        }, 0);
      }
    };
  }, []);

  // Manage weather layers
  useEffect(() => {
    if (!map.current) return;

    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
    if (!apiKey) {
      console.warn('NEXT_PUBLIC_OPENWEATHERMAP_API_KEY is not set');
      return;
    }

    const currentMap = map.current;

    // Remove layers that are no longer active
    weatherLayerIds.current.forEach((layerId) => {
      if (!activeLayers.includes(layerId)) {
        if (currentMap.getLayer(layerId)) {
          currentMap.removeLayer(layerId);
        }
        if (currentMap.getSource(layerId)) {
          currentMap.removeSource(layerId);
        }
        weatherLayerIds.current.delete(layerId);
      }
    });

    // Add new layers
    activeLayers.forEach((layerCode) => {
      if (weatherLayerIds.current.has(layerCode)) {
        // Layer already exists, update opacity
        if (currentMap.getLayer(layerCode)) {
          currentMap.setPaintProperty(layerCode, 'raster-opacity', layerOpacity);
        }
        return;
      }

      const layerConfig = getLayerByCode(layerCode);
      if (!layerConfig) return;

      try {
        // Build tile URL with custom palette
        const tileUrl = buildTileLayerUrl(layerCode, apiKey, {
          opacity: layerOpacity,
          palette: layerConfig.palette,
          fillBound: true,
          // Wind layer specific params
          ...(layerCode === 'WND' && {
            arrowStep: 32,
            useNorm: false,
          }),
        });

        // Add source
        currentMap.addSource(layerCode, {
          type: 'raster',
          tiles: [tileUrl],
          tileSize: 256,
          attribution: '© OpenWeatherMap',
        });

        // Find the first marker layer to insert weather layers before it
        const layers = currentMap.getStyle().layers;
        let firstMarkerLayerId: string | undefined;

        // Weather layers should be below markers but above base map
        // Insert before the first symbol layer (if any)
        for (const layer of layers || []) {
          if (layer.type === 'symbol') {
            firstMarkerLayerId = layer.id;
            break;
          }
        }

        // Add layer (below markers)
        currentMap.addLayer(
          {
            id: layerCode,
            type: 'raster',
            source: layerCode,
            paint: {
              'raster-opacity': layerOpacity,
            },
          },
          firstMarkerLayerId, // Insert before first symbol layer
        );

        weatherLayerIds.current.add(layerCode);

        // Listen for tile errors with debouncing to avoid multiple triggers
        let errorCount = 0;
        const errorHandler = (e: { sourceId?: string; error?: Error }) => {
          if (e.sourceId === layerCode) {
            errorCount++;
            console.warn(`[WeatherMap] Tile error for ${layerCode} (count: ${errorCount}):`, e);

            // Only report as failed after multiple consecutive errors
            // (Some tiles may temporarily fail but recover)
            if (errorCount >= 3 && onLayerError) {
              console.error(`[WeatherMap] Layer ${layerCode} failed after ${errorCount} errors`);
              onLayerError(
                layerCode,
                new Error(
                  `Failed to load tiles for ${layerCode}: ${e.error?.message || 'Network error'}`,
                ),
              );

              // Remove failed layer
              if (currentMap.getLayer(layerCode)) {
                currentMap.removeLayer(layerCode);
              }
              if (currentMap.getSource(layerCode)) {
                currentMap.removeSource(layerCode);
              }
              weatherLayerIds.current.delete(layerCode);

              // Remove error listener after cleanup
              currentMap.off('error', errorHandler);
            }
          }
        };

        currentMap.on('error', errorHandler);
      } catch (error) {
        console.error(`[WeatherMap] Failed to add weather layer ${layerCode}:`, error);
        if (onLayerError) {
          onLayerError(layerCode, error as Error);
        }
      }
    });

    // Update opacity for all active layers
    weatherLayerIds.current.forEach((layerId) => {
      if (currentMap.getLayer(layerId)) {
        currentMap.setPaintProperty(layerId, 'raster-opacity', layerOpacity);
      }
    });
  }, [activeLayers, layerOpacity, onLayerError]);

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
          <div className="text-xs font-semibold text-slate-700 mb-2">Temperature Scale</div>
          <div className="space-y-1">
            {[
              { range: '≤0°C', color: '#3b82f6', label: 'Freezing' },
              { range: '1-10°C', color: '#06b6d4', label: 'Cold' },
              { range: '11-20°C', color: '#22c55e', label: 'Cool' },
              { range: '21-25°C', color: '#84cc16', label: 'Mild' },
              { range: '26-30°C', color: '#eab308', label: 'Warm' },
              { range: '31-35°C', color: '#f97316', label: 'Hot' },
              { range: '>35°C', color: '#ef4444', label: 'Very Hot' },
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
