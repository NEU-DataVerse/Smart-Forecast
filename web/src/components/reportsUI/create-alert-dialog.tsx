import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/text-area';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, Loader2 } from 'lucide-react';
import {
  IIncident,
  IncidentTypeLabels,
  AlertLevel,
  AlertType,
  AlertLevelLabels,
  AlertTypeLabels,
} from '@smart-forecast/shared';

interface CreateAlertDialogProps {
  report: IIncident | null;
  open: boolean;
  message: string;
  onMessageChange: (message: string) => void;
  alertLevel: AlertLevel;
  onAlertLevelChange: (level: AlertLevel) => void;
  alertType: AlertType;
  onAlertTypeChange: (type: AlertType) => void;
  bufferMeters: number;
  onBufferChange: (buffer: number) => void;
  onClose: () => void;
  onCreate: () => void;
  isCreating?: boolean;
}

export function CreateAlertDialog({
  report,
  open,
  message,
  onMessageChange,
  alertLevel,
  onAlertLevelChange,
  alertType,
  onAlertTypeChange,
  bufferMeters,
  onBufferChange,
  onClose,
  onCreate,
  isCreating = false,
}: CreateAlertDialogProps) {
  if (!report) return null;

  // Format buffer display
  const formatBuffer = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

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

          {/* Alert Level Select */}
          <div className="space-y-2">
            <Label htmlFor="alertLevel">Mức độ cảnh báo</Label>
            <Select
              value={alertLevel}
              onValueChange={(value) => onAlertLevelChange(value as AlertLevel)}
            >
              <SelectTrigger id="alertLevel">
                <SelectValue placeholder="Chọn mức độ" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(AlertLevelLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Alert Type Select */}
          <div className="space-y-2">
            <Label htmlFor="alertType">Loại cảnh báo</Label>
            <Select
              value={alertType}
              onValueChange={(value) => onAlertTypeChange(value as AlertType)}
            >
              <SelectTrigger id="alertType">
                <SelectValue placeholder="Chọn loại cảnh báo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(AlertTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Buffer Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="bufferSlider">Bán kính cảnh báo</Label>
              <span className="text-sm font-medium text-primary">{formatBuffer(bufferMeters)}</span>
            </div>
            <Slider
              id="bufferSlider"
              value={[bufferMeters]}
              onValueChange={(value) => onBufferChange(value[0])}
              min={100}
              max={5000}
              step={100}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Điều chỉnh bán kính vùng ảnh hưởng từ 100m đến 5km
            </p>
          </div>

          <div>
            <Label htmlFor="alertMessage" className="text-slate-500 mb-2">
              Nội dung cảnh báo
            </Label>
            <Textarea
              id="alertMessage"
              placeholder="Nhập nội dung cảnh báo cho người dân xung quanh..."
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={onCreate} className="flex-1" disabled={!message.trim() || isCreating}>
              {isCreating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <AlertTriangle className="h-4 w-4 mr-2" />
              )}
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
