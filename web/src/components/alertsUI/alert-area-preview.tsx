'use client';

import dynamic from 'next/dynamic';
import type { GeoPolygon, AlertLevel } from '@smart-forecast/shared';

interface AlertAreaPreviewProps {
  area: GeoPolygon;
  level: AlertLevel;
  height?: string;
}

// Dynamic import to avoid SSR issues with Leaflet
const AlertAreaPreviewComponent = dynamic(
  () => import('./AlertAreaPreview').then((mod) => mod.AlertAreaPreviewComponent),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg h-[250px]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    ),
  },
);

/**
 * AlertAreaPreview - Display alert area polygon on a small map
 */
export function AlertAreaPreview(props: AlertAreaPreviewProps) {
  return <AlertAreaPreviewComponent {...props} />;
}
