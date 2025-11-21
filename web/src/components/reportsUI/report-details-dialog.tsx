import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Image as ImageIcon, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { IIncident } from '@/../../shared/src/types/incident.types';
import {
  IncidentStatus,
  IncidentTypeLabels,
  IncidentStatusLabels,
} from '@/../../shared/src/constants';
import { formatDate, getLocationString } from './report-utils';

interface ReportDetailsDialogProps {
  report: IIncident | null;
  open: boolean;
  onClose: () => void;
  onApprove: (reportId: string) => void;
  onReject: (reportId: string) => void;
  onCreateAlert: () => void;
}

export function ReportDetailsDialog({
  report,
  open,
  onClose,
  onApprove,
  onReject,
  onCreateAlert,
}: ReportDetailsDialogProps) {
  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report Details</DialogTitle>
          <DialogDescription>Review and take action on this report</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-slate-900">{IncidentTypeLabels[report.type]}</h3>
              <p className="text-slate-500">Người báo cáo: {report.reportedBy}</p>
            </div>
            <Badge variant={report.status === IncidentStatus.PENDING ? 'secondary' : 'default'}>
              {IncidentStatusLabels[report.status]}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500">Trạng thái</p>
              <Badge className="mt-1">{IncidentStatusLabels[report.status]}</Badge>
            </div>
            <div>
              <p className="text-slate-500">Thời gian báo cáo</p>
              <p className="text-slate-900 mt-1">{formatDate(report.createdAt)}</p>
            </div>
          </div>

          <div>
            <p className="text-slate-500 mb-2">Mô tả</p>
            <p className="text-slate-900">{report.description}</p>
          </div>

          <div>
            <p className="text-slate-500 mb-2">Vị trí</p>
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-slate-900">{getLocationString(report.location.coordinates)}</p>
                <p className="text-slate-600">
                  Tọa độ: {report.location.coordinates[1]}, {report.location.coordinates[0]}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-slate-500 mb-2">Hình ảnh ({report.imageUrls.length})</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {report.imageUrls.map((url, i) => (
                <div
                  key={i}
                  className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden"
                >
                  <ImageIcon className="h-8 w-8 text-slate-400" />
                </div>
              ))}
            </div>
          </div>

          {report.adminNotes && (
            <div>
              <p className="text-slate-500 mb-2">Ghi chú của Admin</p>
              <p className="text-slate-900 p-3 bg-slate-50 rounded-lg">{report.adminNotes}</p>
            </div>
          )}

          {report.status === IncidentStatus.PENDING && (
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button className="flex-1" onClick={() => onApprove(report.id)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Xác nhận báo cáo
              </Button>
              <Button variant="outline" className="flex-1" onClick={onCreateAlert}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Tạo cảnh báo
              </Button>
              <Button
                variant="destructive"
                className="sm:flex-initial"
                onClick={() => onReject(report.id)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Từ chối
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
