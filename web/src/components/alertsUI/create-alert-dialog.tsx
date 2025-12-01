'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/text-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PolygonDrawer } from '@/components/maps/PolygonDrawer';
import { useCreateAlert } from '@/hooks/useAlertQuery';
import {
  AlertLevel,
  AlertType,
  AlertLevelLabels,
  AlertLevelColors,
  AlertTypeLabels,
  type IAlert,
  type ICreateAlertRequest,
  type GeoPolygon,
} from '@smart-forecast/shared';
import { Send, Loader2, MapPin } from 'lucide-react';

interface CreateAlertDialogProps {
  open: boolean;
  onClose: () => void;
  /** Pre-fill form data (for resend functionality) */
  prefillData?: IAlert | null;
}

export function CreateAlertDialog({ open, onClose, prefillData }: CreateAlertDialogProps) {
  const createAlert = useCreateAlert();

  // Form state
  const [level, setLevel] = useState<AlertLevel>(AlertLevel.MEDIUM);
  const [type, setType] = useState<AlertType>(AlertType.WEATHER);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [advice, setAdvice] = useState('');
  const [area, setArea] = useState<GeoPolygon | undefined>(undefined);
  const [expiresAt, setExpiresAt] = useState('');
  const [showMap, setShowMap] = useState(false);

  // Reset form when dialog opens/closes or prefill data changes
  useEffect(() => {
    if (open) {
      if (prefillData) {
        setLevel(prefillData.level);
        setType(prefillData.type);
        setTitle(prefillData.title);
        setMessage(prefillData.message);
        setAdvice(prefillData.advice || '');
        setArea(prefillData.area);
        setShowMap(!!prefillData.area);
        // Don't prefill expiration - let user set new one
        setExpiresAt('');
      } else {
        // Reset to defaults
        setLevel(AlertLevel.MEDIUM);
        setType(AlertType.WEATHER);
        setTitle('');
        setMessage('');
        setAdvice('');
        setArea(undefined);
        setExpiresAt('');
        setShowMap(false);
      }
    }
  }, [open, prefillData]);

  const handleSubmit = async () => {
    const data: ICreateAlertRequest = {
      level,
      type,
      title,
      message,
      advice: advice || undefined,
      area,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    };

    try {
      await createAlert.mutateAsync(data);
      onClose();
    } catch {
      // Error is handled by the API client toast
    }
  };

  const isValid = title.trim() && message.trim();
  const isResend = !!prefillData;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isResend ? 'Gửi lại cảnh báo' : 'Tạo cảnh báo mới'}</DialogTitle>
          <DialogDescription>
            {isResend
              ? 'Chỉnh sửa nội dung và gửi lại cảnh báo này đến người dùng'
              : 'Tạo và gửi cảnh báo mới đến người dùng trong khu vực bị ảnh hưởng'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Level and Type row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Mức độ cảnh báo</Label>
              <Select value={level} onValueChange={(v) => setLevel(v as AlertLevel)}>
                <SelectTrigger id="level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AlertLevel).map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: AlertLevelColors[lvl] }}
                        />
                        {AlertLevelLabels[lvl]}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Loại cảnh báo</Label>
              <Select value={type} onValueChange={(v) => setType(v as AlertType)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AlertType).map((t) => (
                    <SelectItem key={t} value={t}>
                      {AlertTypeLabels[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề cảnh báo..."
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Nội dung cảnh báo *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mô tả chi tiết về tình huống và các thông tin cần thiết..."
              rows={4}
            />
          </div>

          {/* Advice */}
          <div className="space-y-2">
            <Label htmlFor="advice">Lời khuyên (tùy chọn)</Label>
            <Textarea
              id="advice"
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              placeholder="Khuyến cáo cho người dùng..."
              rows={2}
            />
          </div>

          {/* Expiration */}
          <div className="space-y-2">
            <Label htmlFor="expiresAt">Thời gian hết hạn (tùy chọn)</Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          {/* Area selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Khu vực ảnh hưởng (tùy chọn)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowMap(!showMap)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {showMap ? 'Ẩn bản đồ' : 'Chọn trên bản đồ'}
              </Button>
            </div>
            {showMap && (
              <div className="mt-2">
                <PolygonDrawer value={area} onChange={setArea} height="300px" />
                <p className="text-xs text-muted-foreground mt-1">
                  Nhấp vào biểu tượng đa giác ở góc phải để vẽ khu vực. Nhấp để thêm điểm, nhấp đúp
                  để hoàn thành.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={createAlert.isPending}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || createAlert.isPending}>
            {createAlert.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {isResend ? 'Gửi lại cảnh báo' : 'Gửi cảnh báo'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
