import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { MapPin, Users, Send, Clock, Timer, Zap } from 'lucide-react';
import {
  IAlert,
  AlertLevel,
  AlertType,
  AlertLevelLabels,
  AlertLevelColors,
  AlertTypeLabels,
} from '@smart-forecast/shared';

interface AlertDetailsDialogProps {
  alert: IAlert | null;
  open: boolean;
  onClose: () => void;
  onResend: (alert: IAlert) => void;
}

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
 * Get formatted date string for display
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

export function AlertDetailsDialog({ alert, open, onClose, onResend }: AlertDetailsDialogProps) {
  if (!alert) return null;

  const active = isAlertActive(alert);
  const levelColor = AlertLevelColors[alert.level];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết cảnh báo</DialogTitle>
          <DialogDescription>Thông tin đầy đủ về cảnh báo này</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-semibold text-slate-900">{alert.title}</h3>
            <Badge variant={active ? 'default' : 'secondary'}>
              {active ? 'Đang hoạt động' : 'Đã hết hạn'}
            </Badge>
            <Badge
              style={{
                backgroundColor: levelColor,
                color: alert.level === AlertLevel.MEDIUM ? '#000' : '#fff',
              }}
            >
              {AlertLevelLabels[alert.level]}
            </Badge>
            {alert.isAutomatic && (
              <Badge variant="outline" className="border-orange-300 text-orange-600">
                <Zap className="h-3 w-3 mr-1" />
                Tự động
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-500">Loại cảnh báo</Label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="text-slate-900">{AlertTypeLabels[alert.type]}</span>
              </div>
            </div>
            <div>
              <Label className="text-slate-500">Người tạo</Label>
              <p className="text-slate-900 mt-1">
                {alert.isAutomatic ? 'Hệ thống' : alert.createdBy || 'Admin'}
              </p>
            </div>
            <div>
              <Label className="text-slate-500">Thời gian gửi</Label>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-slate-900">{formatAlertDate(alert.sentAt)}</span>
              </div>
            </div>
            <div>
              <Label className="text-slate-500">Thời hạn còn lại</Label>
              <div className="flex items-center gap-2 mt-1">
                <Timer className="h-4 w-4 text-slate-400" />
                <span className={!active ? 'text-red-500' : 'text-slate-900'}>
                  {getTimeUntilExpiration(alert.expiresAt)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-slate-500">Nội dung cảnh báo</Label>
            <p className="text-slate-900 mt-1 p-3 bg-slate-50 rounded-lg">{alert.message}</p>
          </div>

          {alert.advice && (
            <div>
              <Label className="text-slate-500">Lời khuyên</Label>
              <p className="text-slate-900 mt-1 p-3 bg-blue-50 rounded-lg border border-blue-100">
                {alert.advice}
              </p>
            </div>
          )}

          <div>
            <Label className="text-slate-500">Người nhận</Label>
            <div className="flex items-center gap-2 mt-1">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-slate-900">
                {(alert.sentCount || 0).toLocaleString()} người đã được thông báo
              </span>
            </div>
          </div>

          {alert.area && (
            <div>
              <Label className="text-slate-500">Vùng ảnh hưởng</Label>
              <p className="text-slate-600 mt-1 text-sm">
                Đã xác định vùng địa lý cụ thể (xem bản đồ khi gửi lại)
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button className="flex-1" onClick={() => onResend(alert)}>
              <Send className="h-4 w-4 mr-2" />
              Gửi lại cảnh báo
            </Button>
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
