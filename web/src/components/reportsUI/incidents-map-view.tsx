'use client';

import { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Supercluster from 'supercluster';
import {
  IIncident,
  IncidentStatus,
  IncidentType,
  IncidentTypeLabels,
  IncidentStatusLabels,
} from '@smart-forecast/shared';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDate, getLocationString, getReporterName, getStatusVariant } from './report-utils';
import { MapPin, Calendar, User, FileText, ExternalLink } from 'lucide-react';

interface IncidentsMapViewProps {
  incidents: IIncident[];
  onSelectIncident: (incident: IIncident) => void;
  isLoading?: boolean;
}

// Colors for different incident types
const INCIDENT_TYPE_COLORS: Record<IncidentType, string> = {
  [IncidentType.FLOODING]: '#3b82f6', // blue
  [IncidentType.FALLEN_TREE]: '#22c55e', // green
  [IncidentType.LANDSLIDE]: '#a855f7', // purple
  [IncidentType.AIR_POLLUTION]: '#6b7280', // gray
  [IncidentType.ROAD_DAMAGE]: '#f59e0b', // amber
  [IncidentType.OTHER]: '#64748b', // slate
};

// Colors for different statuses
const STATUS_COLORS: Record<IncidentStatus, string> = {
  [IncidentStatus.PENDING]: '#f59e0b', // amber
  [IncidentStatus.VERIFIED]: '#3b82f6', // blue
  [IncidentStatus.IN_PROGRESS]: '#8b5cf6', // violet
  [IncidentStatus.REJECTED]: '#ef4444', // red
  [IncidentStatus.RESOLVED]: '#22c55e', // green
};

export function IncidentsMapView({
  incidents,
  onSelectIncident,
  isLoading = false,
}: IncidentsMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const clusterIndex = useRef<Supercluster | null>(null);

  // Sheet state for incident detail
  const [selectedIncident, setSelectedIncident] = useState<IIncident | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleMarkerClick = useCallback((incident: IIncident) => {
    setSelectedIncident(incident);
    setIsSheetOpen(true);
  }, []);

  const handleViewDetails = useCallback(() => {
    if (selectedIncident) {
      setIsSheetOpen(false);
      onSelectIncident(selectedIncident);
    }
  }, [selectedIncident, onSelectIncident]);

  // Convert incidents to GeoJSON features
  const geoJsonPoints = useMemo(() => {
    return incidents.map((incident) => ({
      type: 'Feature' as const,
      properties: {
        id: incident.id,
        type: incident.type,
        status: incident.status,
        description: incident.description,
        incident: incident,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: incident.location.coordinates,
      },
    }));
  }, [incidents]);

  // Update markers when incidents or zoom changes
  const updateMarkers = useCallback(() => {
    if (!map.current || !clusterIndex.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const bounds = map.current.getBounds();
    const zoom = Math.floor(map.current.getZoom());

    // Get clusters for current view
    const clusters = clusterIndex.current.getClusters(
      [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
      zoom,
    );

    clusters.forEach((cluster) => {
      const [lng, lat] = cluster.geometry.coordinates;
      const properties = cluster.properties;

      if (properties.cluster) {
        // Cluster marker
        const clusterEl = document.createElement('div');
        clusterEl.className = 'cluster-marker';
        clusterEl.innerHTML = `<span>${properties.point_count}</span>`;
        clusterEl.style.cssText = `
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          border: 2px solid white;
        `;

        clusterEl.addEventListener('click', () => {
          if (!map.current || !clusterIndex.current) return;
          const expansionZoom = clusterIndex.current.getClusterExpansionZoom(properties.cluster_id);
          map.current.easeTo({
            center: [lng, lat],
            zoom: expansionZoom,
          });
        });

        const marker = new maplibregl.Marker({ element: clusterEl })
          .setLngLat([lng, lat])
          .addTo(map.current!);
        markersRef.current.push(marker);
      } else {
        // Individual incident marker
        const incident = properties.incident as IIncident;
        const color = STATUS_COLORS[incident.status] || '#3b82f6';

        const markerEl = document.createElement('div');
        markerEl.className = 'incident-marker';
        markerEl.innerHTML = `
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
            <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0z" fill="${color}"/>
            <circle cx="16" cy="16" r="8" fill="white"/>
          </svg>
        `;
        markerEl.style.cssText = `
          cursor: pointer;
          transform: translate(-50%, -100%);
        `;

        markerEl.addEventListener('click', () => {
          handleMarkerClick(incident);
        });

        // Create popup
        const popup = new maplibregl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: false,
        }).setHTML(`
          <div style="padding: 8px; max-width: 200px;">
            <strong>${IncidentTypeLabels[incident.type]}</strong>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
              ${IncidentStatusLabels[incident.status]}
            </div>
            <div style="font-size: 12px; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${incident.description}
            </div>
          </div>
        `);

        const marker = new maplibregl.Marker({ element: markerEl })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map.current!);

        markerEl.addEventListener('mouseenter', () => marker.togglePopup());
        markerEl.addEventListener('mouseleave', () => marker.togglePopup());

        markersRef.current.push(marker);
      }
    });
  }, [handleMarkerClick]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

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
      center: [105.8342, 21.0278], // Hanoi center
      zoom: 12,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.FullscreenControl(), 'top-right');

    map.current.on('moveend', updateMarkers);
    map.current.on('zoomend', updateMarkers);

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      if (map.current) {
        map.current.remove();
      }
    };
  }, [updateMarkers]);

  // Update cluster index when incidents change
  useEffect(() => {
    clusterIndex.current = new Supercluster({
      radius: 60,
      maxZoom: 16,
    });
    clusterIndex.current.load(geoJsonPoints);

    if (map.current && map.current.loaded()) {
      updateMarkers();

      // Fit bounds to all incidents if there are any
      if (incidents.length > 0) {
        const bounds = new maplibregl.LngLatBounds();
        incidents.forEach((incident) => {
          bounds.extend(incident.location.coordinates as [number, number]);
        });
        map.current.fitBounds(bounds, { padding: 50, maxZoom: 14 });
      }
    }
  }, [geoJsonPoints, incidents, updateMarkers]);

  return (
    <div className="relative w-full h-[calc(100vh-200px)] min-h-[600px]">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 z-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div
        ref={mapContainer}
        className="w-full h-full rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
      />
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Trạng thái</p>
        <div className="space-y-1">
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-slate-600 dark:text-slate-400">
                {IncidentStatusLabels[status as IncidentStatus]}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Incident count */}
      <div className="absolute top-4 left-4 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {incidents.length} sự cố
        </span>
      </div>

      {/* Incident Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-hidden p-0">
          {selectedIncident && (
            <>
              <SheetHeader className="p-6 pb-4 border-b">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <SheetTitle className="text-lg">
                      {IncidentTypeLabels[selectedIncident.type]}
                    </SheetTitle>
                    <SheetDescription>{formatDate(selectedIncident.createdAt)}</SheetDescription>
                  </div>
                  <Badge variant={getStatusVariant(selectedIncident.status)}>
                    {IncidentStatusLabels[selectedIncident.status]}
                  </Badge>
                </div>
              </SheetHeader>

              <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="p-6 space-y-6">
                  {/* Image */}
                  {selectedIncident.imageUrls && selectedIncident.imageUrls.length > 0 && (
                    <div className="rounded-lg overflow-hidden border">
                      <img
                        src={selectedIncident.imageUrls[0]}
                        alt="Hình ảnh sự cố"
                        className="w-full h-48 object-cover"
                      />
                      {selectedIncident.imageUrls.length > 1 && (
                        <div className="p-2 bg-slate-50 dark:bg-slate-800 text-xs text-center text-slate-500">
                          +{selectedIncident.imageUrls.length - 1} ảnh khác
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <FileText className="h-4 w-4" />
                      Mô tả
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {selectedIncident.description}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <MapPin className="h-4 w-4" />
                      Vị trí
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {getLocationString(selectedIncident.location.coordinates)}
                    </p>
                  </div>

                  {/* Reporter */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <User className="h-4 w-4" />
                      Người báo cáo
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {getReporterName(selectedIncident.reportedBy)}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Calendar className="h-4 w-4" />
                      Thời gian
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      <p>Tạo: {formatDate(selectedIncident.createdAt)}</p>
                      {selectedIncident.updatedAt !== selectedIncident.createdAt && (
                        <p>Cập nhật: {formatDate(selectedIncident.updatedAt)}</p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedIncident.adminNotes && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <FileText className="h-4 w-4" />
                        Ghi chú xử lý
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                        {selectedIncident.adminNotes}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Footer with action button */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white dark:bg-slate-950">
                <Button onClick={handleViewDetails} className="w-full gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Xem chi tiết & Xử lý
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
