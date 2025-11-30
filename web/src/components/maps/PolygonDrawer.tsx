'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { GeoPolygon } from '@smart-forecast/shared';

// Dynamic import to avoid SSR issues with Leaflet
const PolygonDrawerComponent = dynamic(
  () => import('./PolygonDrawerComponent').then((mod) => mod.PolygonDrawerComponent),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-[300px] rounded-lg" />,
  },
);

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
 * Polygon drawer with SSR-safe dynamic import
 */
export function PolygonDrawer(props: PolygonDrawerProps) {
  return <PolygonDrawerComponent {...props} />;
}

export default PolygonDrawer;
