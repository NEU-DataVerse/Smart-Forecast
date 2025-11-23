import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/text-area';
import { AlertTriangle } from 'lucide-react';
import { IIncident } from '@/../../shared/src/types/incident.types';
import { IncidentTypeLabels } from '@/../../shared/src/constants';

interface CreateAlertDialogProps {
  report: IIncident | null;
  open: boolean;
  message: string;
  onMessageChange: (message: string) => void;
  onClose: () => void;
  onCreate: () => void;
}

export function CreateAlertDialog({
  report,
  open,
  message,
  onMessageChange,
  onClose,
  onCreate,
}: CreateAlertDialogProps) {
  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tạo cảnh báo từ báo cáo</DialogTitle>
          <DialogDescription>
            Gửi cảnh báo thiên tai dựa trên báo cáo đã xác nhận này
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-slate-500">Loại sự cố</p>
            <p className="text-slate-900">{IncidentTypeLabels[report.type]}</p>
          </div>

          <div>
            <p className="text-slate-500 mb-2">Nội dung cảnh báo</p>
            <Textarea
              placeholder="Nhập nội dung cảnh báo cho người dân xung quanh..."
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={onCreate} className="flex-1">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Tạo & Gửi cảnh báo
            </Button>
            <Button variant="outline" className="sm:flex-initial" onClick={onClose}>
              Hủy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
