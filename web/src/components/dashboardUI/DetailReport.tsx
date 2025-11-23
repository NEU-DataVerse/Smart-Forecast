import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { recentReports } from '@/services/data/dashboard.api';
interface DetailsReportsProps {
  selectedReport: (typeof recentReports)[0] | null;
  setSelectedReport: (report: (typeof recentReports)[0] | null) => void;
}

export default function DetailsReport({ selectedReport, setSelectedReport }: DetailsReportsProps) {
  return (
    <Dialog
      open={!!selectedReport}
      onOpenChange={(open: boolean) => !open && setSelectedReport(null)}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Report Details</DialogTitle>
          <DialogDescription>Submitted {selectedReport?.time}</DialogDescription>
        </DialogHeader>
        {selectedReport && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">Location</div>
                <div className="text-sm text-slate-900">{selectedReport.location}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Type</div>
                <div className="text-sm text-slate-900">{selectedReport.type}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Status</div>
                <Badge
                  variant={selectedReport.status === 'Approved' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {selectedReport.status}
                </Badge>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Severity</div>
                <Badge
                  variant={selectedReport.severity === 'High' ? 'destructive' : 'default'}
                  className="text-xs"
                >
                  {selectedReport.severity}
                </Badge>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1">Reporter</div>
              <div className="text-sm text-slate-900">{selectedReport.reporter}</div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1">Coordinates</div>
              <div className="text-sm text-slate-900 font-mono">{selectedReport.coordinates}</div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1">Description</div>
              <div className="text-sm text-slate-900 leading-relaxed">
                {selectedReport.description}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1">Attachments</div>
              <div className="text-sm text-slate-900">
                {selectedReport.images} image(s) attached
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
