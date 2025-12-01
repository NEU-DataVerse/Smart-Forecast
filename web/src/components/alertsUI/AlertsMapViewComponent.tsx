'use client';

import { useEffect, useMemo, useCallback, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import type { IAlert, AlertLevel } from '@smart-forecast/shared';
import { AlertLevelLabels, AlertTypeLabels } from '@smart-forecast/shared';
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
import { MapPin, Calendar, Users, Timer, Bell, ExternalLink } from 'lucide-react';

import 'leaflet/dist/leaflet.css';

// Override Leaflet z-index to be lower than Sheet
const leafletZIndexStyle = `
  .leaflet-pane,
  .leaflet-top,
  .leaflet-bottom,
  .leaflet-control {
    z-index: auto !important;
  }
  .leaflet-map-pane {
    z-index: 1 !important;
  }
  .leaflet-tile-pane {
    z-index: 2 !important;
  }
  .leaflet-overlay-pane {
    z-index: 4 !important;
  }
  .leaflet-shadow-pane {
    z-index: 5 !important;
  }
  .leaflet-marker-pane {
    z-index: 6 !important;
  }
  .leaflet-tooltip-pane {
    z-index: 7 !important;
  }
  .leaflet-popup-pane {
    z-index: 8 !important;
  }
  .leaflet-control {
    z-index: 10 !important;
  }
`;

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface AlertsMapViewProps {
  alerts: IAlert[];
  onSelectAlert: (alert: IAlert) => void;
  isLoading?: boolean;
}

// Colors for different alert levels
const ALERT_LEVEL_COLORS: Record<AlertLevel, string> = {
  LOW: '#22c55e', // green
  MEDIUM: '#f59e0b', // amber
  HIGH: '#f97316', // orange
  CRITICAL: '#ef4444', // red
};

// Fill opacity for polygons
const ALERT_LEVEL_OPACITY: Record<AlertLevel, number> = {
  LOW: 0.3,
  MEDIUM: 0.4,
  HIGH: 0.5,
  CRITICAL: 0.6,
};

/**
 * Check if an alert is currently active based on expiration time
 */
function isAlertActive(alert: IAlert): boolean {
  if (!alert.expiresAt) return true;
  return new Date() < new Date(alert.expiresAt);
}

/**
 * Get time remaining until alert expires
 */
function getTimeUntilExpiration(expiresAt: Date | undefined): string {
  if (!expiresAt) return 'Không giới hạn';

  const now = new Date();
  const expirationDate = new Date(expiresAt);
  const diffMs = expirationDate.getTime() - now.getTime();

  if (diffMs <= 0) return 'Đã hết hạn';

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    const remainingHours = diffHours % 24;
    return `${diffDays} ngày ${remainingHours} giờ`;
  } else if (diffHours > 0) {
    const remainingMins = diffMins % 60;
    return `${diffHours} giờ ${remainingMins} phút`;
  } else {
    return `${diffMins} phút`;
  }
}

/**
 * Format date for display
 */
function formatAlertDate(date: Date): string {
  const d = new Date(date);
  return d.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Component to fit bounds to all alerts
function FitBounds({ alerts }: { alerts: IAlert[] }) {
  const map = useMap();

  useEffect(() => {
    if (alerts.length === 0) return;

    const bounds = L.latLngBounds([]);

    alerts.forEach((alert) => {
      if (alert.area && alert.area.coordinates && alert.area.coordinates[0]) {
        alert.area.coordinates[0].forEach((coord: number[]) => {
          // GeoJSON is [lng, lat], Leaflet is [lat, lng]
          bounds.extend([coord[1], coord[0]]);
        });
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [alerts, map]);

  return null;
}

// Alert polygon component
function AlertPolygon({ alert, onClick }: { alert: IAlert; onClick: (alert: IAlert) => void }) {
  const active = isAlertActive(alert);
  const color = ALERT_LEVEL_COLORS[alert.level];
  const opacity = ALERT_LEVEL_OPACITY[alert.level];

  // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
  const positions = useMemo(() => {
    if (!alert.area || !alert.area.coordinates || !alert.area.coordinates[0]) {
      return [];
    }
    return alert.area.coordinates[0].map(
      (coord: number[]) => [coord[1], coord[0]] as [number, number],
    );
  }, [alert.area]);

  if (positions.length === 0) return null;

  return (
    <Polygon
      positions={positions}
      pathOptions={{
        color: color,
        fillColor: color,
        fillOpacity: active ? opacity : opacity * 0.5,
        weight: active ? 3 : 1,
        opacity: active ? 1 : 0.5,
        dashArray: active ? undefined : '5, 5',
      }}
      eventHandlers={{
        click: () => onClick(alert),
      }}
    >
      <Popup>
        <div className="min-w-[200px]">
          <h3 className="font-semibold text-sm mb-1">{alert.title}</h3>
          <p className="text-xs text-gray-600 mb-2">{AlertTypeLabels[alert.type]}</p>
          <div className="flex gap-1">
            <span
              className="px-2 py-0.5 rounded text-xs text-white"
              style={{ backgroundColor: color }}
            >
              {AlertLevelLabels[alert.level]}
            </span>
            {!active && (
              <span className="px-2 py-0.5 rounded text-xs bg-gray-200 text-gray-600">
                Đã hết hạn
              </span>
            )}
          </div>
        </div>
      </Popup>
    </Polygon>
  );
}

export function AlertsMapViewComponent({
  alerts,
  onSelectAlert,
  isLoading = false,
}: AlertsMapViewProps) {
  // Sheet state for alert detail
  const [selectedAlert, setSelectedAlert] = useState<IAlert | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Filter alerts that have area
  const alertsWithArea = useMemo(() => {
    return alerts.filter((alert) => {
      if (!alert.area) return false;
      if (!alert.area.coordinates) return false;
      if (!Array.isArray(alert.area.coordinates)) return false;
      if (alert.area.coordinates.length === 0) return false;
      if (!alert.area.coordinates[0] || alert.area.coordinates[0].length < 3) return false;
      return true;
    });
  }, [alerts]);

  const handlePolygonClick = useCallback((alert: IAlert) => {
    setSelectedAlert(alert);
    setIsSheetOpen(true);
  }, []);

  const handleViewDetails = useCallback(() => {
    if (selectedAlert) {
      setIsSheetOpen(false);
      onSelectAlert(selectedAlert);
    }
  }, [selectedAlert, onSelectAlert]);

  return (
    <div className="relative w-full h-[calc(100vh-200px)] min-h-[600px]">
      {/* Inject Leaflet z-index override styles */}
      <style dangerouslySetInnerHTML={{ __html: leafletZIndexStyle }} />

      {isLoading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 z-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      <MapContainer
        center={[21.0285, 105.8542]}
        zoom={11}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render alert polygons */}
        {alertsWithArea.map((alert) => (
          <AlertPolygon key={alert.id} alert={alert} onClick={handlePolygonClick} />
        ))}

        {/* Fit bounds to alerts */}
        <FitBounds alerts={alertsWithArea} />
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-20">
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
          Mức độ cảnh báo
        </p>
        <div className="space-y-1">
          {Object.entries(ALERT_LEVEL_COLORS).map(([level, color]) => (
            <div key={level} className="flex items-center gap-2 text-xs">
              <div
                className="w-4 h-3 rounded-sm border"
                style={{
                  backgroundColor: color,
                  opacity: ALERT_LEVEL_OPACITY[level as AlertLevel],
                  borderColor: color,
                }}
              />
              <span className="text-slate-600 dark:text-slate-400">
                {AlertLevelLabels[level as AlertLevel]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Alert count - positioned top right to avoid zoom controls */}
      <div className="absolute top-4 right-14 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-20">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {alertsWithArea.length} cảnh báo có vùng ảnh hưởng
        </span>
        {alerts.length !== alertsWithArea.length && (
          <span className="text-xs text-slate-500 ml-2">
            ({alerts.length - alertsWithArea.length} ẩn do không có vùng)
          </span>
        )}
      </div>

      {/* Alert Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-hidden p-0">
          {selectedAlert && (
            <>
              <SheetHeader className="p-6 pb-4 border-b">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <SheetTitle className="text-lg">{selectedAlert.title}</SheetTitle>
                    <SheetDescription>{formatAlertDate(selectedAlert.sentAt)}</SheetDescription>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <Badge
                      style={{
                        backgroundColor: ALERT_LEVEL_COLORS[selectedAlert.level],
                        color: selectedAlert.level === 'MEDIUM' ? '#000' : '#fff',
                      }}
                    >
                      {AlertLevelLabels[selectedAlert.level]}
                    </Badge>
                    <Badge variant={isAlertActive(selectedAlert) ? 'default' : 'destructive'}>
                      {isAlertActive(selectedAlert) ? 'Đang hoạt động' : 'Đã hết hạn'}
                    </Badge>
                  </div>
                </div>
              </SheetHeader>

              <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="p-6 space-y-6">
                  {/* Alert Type */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Bell className="h-4 w-4" />
                      Loại cảnh báo
                    </div>
                    <Badge variant="outline">{AlertTypeLabels[selectedAlert.type]}</Badge>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      Nội dung
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {selectedAlert.message}
                    </p>
                  </div>

                  {/* Advice */}
                  {selectedAlert.advice && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        Khuyến nghị
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        {selectedAlert.advice}
                      </p>
                    </div>
                  )}

                  {/* Area */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <MapPin className="h-4 w-4" />
                      Vùng ảnh hưởng
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedAlert.area ? 'Có vùng ảnh hưởng xác định' : 'Toàn bộ khu vực'}
                    </p>
                  </div>

                  {/* Sent count */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Users className="h-4 w-4" />
                      Người nhận
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {(selectedAlert.sentCount || 0).toLocaleString()} người
                    </p>
                  </div>

                  {/* Time info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Calendar className="h-4 w-4" />
                      Thời gian
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      <p>Gửi lúc: {formatAlertDate(selectedAlert.sentAt)}</p>
                    </div>
                  </div>

                  {/* Expiration */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Timer className="h-4 w-4" />
                      Thời hạn
                    </div>
                    <p
                      className={`text-sm ${
                        !isAlertActive(selectedAlert)
                          ? 'text-red-500'
                          : getTimeUntilExpiration(selectedAlert.expiresAt).includes('phút')
                            ? 'text-orange-500'
                            : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {getTimeUntilExpiration(selectedAlert.expiresAt)}
                    </p>
                  </div>

                  {/* Source info */}
                  {selectedAlert.isAutomatic && (
                    <div className="space-y-2">
                      <Badge variant="outline" className="border-orange-300 text-orange-600">
                        Cảnh báo tự động
                      </Badge>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Footer with action button */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white dark:bg-slate-950">
                <Button onClick={handleViewDetails} className="w-full gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Xem chi tiết
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
