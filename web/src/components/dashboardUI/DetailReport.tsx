'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { IIncident, IncidentStatus, IncidentType } from '@smart-forecast/shared';

// Map IncidentStatus to display config
const statusConfig: Record<
  IncidentStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  PENDING: { label: 'Pending', variant: 'secondary' },
  VERIFIED: { label: 'Verified', variant: 'default' },
  REJECTED: { label: 'Rejected', variant: 'destructive' },
  IN_PROGRESS: { label: 'In Progress', variant: 'outline' },
  RESOLVED: { label: 'Resolved', variant: 'default' },
};

// Map IncidentType to severity display
const typeToSeverity: Record<IncidentType, { label: string; variant: 'destructive' | 'default' }> =
  {
    FLOODING: { label: 'High', variant: 'destructive' },
    LANDSLIDE: { label: 'High', variant: 'destructive' },
    FALLEN_TREE: { label: 'Medium', variant: 'default' },
    AIR_POLLUTION: { label: 'Medium', variant: 'default' },
    ROAD_DAMAGE: { label: 'Medium', variant: 'default' },
    OTHER: { label: 'Low', variant: 'default' },
  };

// Format incident type
function formatIncidentType(type: string): string {
  return type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Format time ago
function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const reportDate = new Date(date);
  const diffMs = now.getTime() - reportDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

interface DetailsReportsProps {
  selectedReport: IIncident | null;
  setSelectedReport: (report: IIncident | null) => void;
}

export default function DetailsReport({ selectedReport, setSelectedReport }: DetailsReportsProps) {
  const statusCfg = selectedReport
    ? statusConfig[selectedReport.status] || statusConfig.PENDING
    : null;
  const severityCfg = selectedReport
    ? typeToSeverity[selectedReport.type] || typeToSeverity.OTHER
    : null;

  // Format coordinates from GeoJSON Point
  const formatCoordinates = (location: IIncident['location']): string => {
    if (!location || location.type !== 'Point' || !location.coordinates) {
      return 'Unknown';
    }
    const [lng, lat] = location.coordinates;
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  return (
    <Dialog
      open={!!selectedReport}
      onOpenChange={(open: boolean) => !open && setSelectedReport(null)}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Report Details</DialogTitle>
          <DialogDescription>
            Submitted {selectedReport ? formatTimeAgo(selectedReport.createdAt) : ''}
          </DialogDescription>
        </DialogHeader>
        {selectedReport && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">Type</div>
                <div className="text-sm text-slate-900">
                  {formatIncidentType(selectedReport.type)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Status</div>
                <Badge variant={statusCfg?.variant || 'secondary'} className="text-xs">
                  {statusCfg?.label || 'Unknown'}
                </Badge>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Severity</div>
                <Badge variant={severityCfg?.variant || 'default'} className="text-xs">
                  {severityCfg?.label || 'Unknown'}
                </Badge>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Reporter</div>
                <div className="text-sm text-slate-900">
                  {selectedReport.reportedBy?.fullName ||
                    selectedReport.reportedBy?.email ||
                    'Anonymous'}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1">Coordinates</div>
              <div className="text-sm text-slate-900 font-mono">
                {formatCoordinates(selectedReport.location)}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1">Description</div>
              <div className="text-sm text-slate-900 leading-relaxed">
                {selectedReport.description || 'No description provided'}
              </div>
            </div>

            {selectedReport.adminNotes && (
              <div>
                <div className="text-xs text-slate-500 mb-1">Admin Notes</div>
                <div className="text-sm text-slate-900 leading-relaxed bg-slate-50 p-2 rounded">
                  {selectedReport.adminNotes}
                </div>
              </div>
            )}

            <div>
              <div className="text-xs text-slate-500 mb-1">Attachments</div>
              {selectedReport.imageUrls && selectedReport.imageUrls.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {selectedReport.imageUrls.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block aspect-square bg-slate-100 rounded overflow-hidden hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={url}
                        alt={`Attachment ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-500">No images attached</div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
