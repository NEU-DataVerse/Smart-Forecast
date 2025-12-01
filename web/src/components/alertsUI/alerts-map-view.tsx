'use client';

import dynamic from 'next/dynamic';
import type { IAlert } from '@smart-forecast/shared';

interface AlertsMapViewProps {
  alerts: IAlert[];
  onSelectAlert: (alert: IAlert) => void;
  isLoading?: boolean;
}

// Dynamic import to avoid SSR issues with Leaflet
const AlertsMapViewComponent = dynamic(
  () => import('./AlertsMapViewComponent').then((mod) => mod.AlertsMapViewComponent),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[calc(100vh-200px)] min-h-[600px] flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    ),
  },
);

/**
 * AlertsMapView - Display alerts on a map with polygons
 * Uses Leaflet for consistent polygon rendering (same library as PolygonDrawer)
 */
export function AlertsMapView(props: AlertsMapViewProps) {
  return <AlertsMapViewComponent {...props} />;
}
