'use client';

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import type { GeoPolygon } from '@smart-forecast/shared';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface PolygonDrawerProps {
  /** Initial polygon to display */
  value?: GeoPolygon;
  /** Callback when polygon changes */
  onChange: (polygon: GeoPolygon | undefined) => void;
  /** Map height */
  height?: string;
  /** Center coordinates [lat, lng] - default to Hanoi */
  center?: [number, number];
  /** Initial zoom level */
  zoom?: number;
  /** Whether the map is read-only */
  readOnly?: boolean;
}

/**
 * Polygon drawing component using Leaflet
 * Allows users to draw/edit a single polygon on the map
 */
export function PolygonDrawerComponent({
  value,
  onChange,
  height = '300px',
  center = [21.0285, 105.8542], // Hanoi coordinates
  zoom = 11,
  readOnly = false,
}: PolygonDrawerProps) {
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  // Initialize polygon from value
  useEffect(() => {
    if (featureGroupRef.current && value) {
      const featureGroup = featureGroupRef.current;
      featureGroup.clearLayers();

      // Convert GeoJSON polygon to Leaflet layer
      const coordinates = value.coordinates[0];
      if (coordinates && coordinates.length > 0) {
        // GeoJSON uses [lng, lat], Leaflet uses [lat, lng]
        const latLngs = coordinates.map((coord) => L.latLng(coord[1], coord[0]) as L.LatLng);
        const polygon = L.polygon(latLngs, {
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.2,
        });
        featureGroup.addLayer(polygon);
      }
    }
  }, [value]);

  // Handle polygon creation
  const handleCreated = useCallback(
    (e: L.DrawEvents.Created) => {
      const layer = e.layer as L.Polygon;
      const latLngs = layer.getLatLngs()[0] as L.LatLng[];

      // Convert Leaflet [lat, lng] to GeoJSON [lng, lat]
      const coordinates = latLngs.map((latLng) => [latLng.lng, latLng.lat]);
      // Close the polygon by repeating first point
      if (coordinates.length > 0) {
        coordinates.push(coordinates[0]);
      }

      const polygon: GeoPolygon = {
        type: 'Polygon',
        coordinates: [coordinates],
      };

      onChange(polygon);

      // Remove any existing polygons (keep only the latest)
      if (featureGroupRef.current) {
        const layers = featureGroupRef.current.getLayers();
        layers.forEach((existingLayer, index) => {
          if (index < layers.length - 1) {
            featureGroupRef.current?.removeLayer(existingLayer);
          }
        });
      }
    },
    [onChange],
  );

  // Handle polygon edit
  const handleEdited = useCallback(
    (e: L.DrawEvents.Edited) => {
      const layers = e.layers;
      layers.eachLayer((layer: L.Layer) => {
        if (layer instanceof L.Polygon) {
          const latLngs = layer.getLatLngs()[0] as L.LatLng[];
          const coordinates = latLngs.map((latLng) => [latLng.lng, latLng.lat]);
          if (coordinates.length > 0) {
            coordinates.push(coordinates[0]);
          }

          const polygon: GeoPolygon = {
            type: 'Polygon',
            coordinates: [coordinates],
          };

          onChange(polygon);
        }
      });
    },
    [onChange],
  );

  // Handle polygon delete
  const handleDeleted = useCallback(() => {
    onChange(undefined);
  }, [onChange]);

  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden border">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup ref={featureGroupRef}>
          {!readOnly && (
            <EditControl
              position="topright"
              onCreated={handleCreated}
              onEdited={handleEdited}
              onDeleted={handleDeleted}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
                polygon: {
                  allowIntersection: false,
                  showArea: true,
                  shapeOptions: {
                    color: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.2,
                  },
                },
              }}
              edit={{
                remove: true,
              }}
            />
          )}
        </FeatureGroup>
      </MapContainer>
    </div>
  );
}
