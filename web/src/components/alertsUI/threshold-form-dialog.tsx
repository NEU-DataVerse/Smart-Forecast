'use client';

import { useState } from 'react';
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
import { useCreateThreshold, useUpdateThreshold } from '@/hooks/useAlertQuery';
import {
  AlertLevel,
  AlertType,
  AlertMetric,
  ThresholdOperator,
  AlertLevelLabels,
  AlertLevelColors,
  AlertMetricLabels,
  AlertMetricUnits,
  AlertTypeLabels,
  type IAlertThreshold,
  type ICreateAlertThresholdRequest,
  type IUpdateAlertThresholdRequest,
} from '@smart-forecast/shared';
import { Loader2, Save } from 'lucide-react';

// Operator labels in Vietnamese
const OperatorLabels: Record<ThresholdOperator, string> = {
  [ThresholdOperator.GT]: '> (lớn hơn)',
  [ThresholdOperator.GTE]: '≥ (lớn hơn hoặc bằng)',
  [ThresholdOperator.LT]: '< (nhỏ hơn)',
  [ThresholdOperator.LTE]: '≤ (nhỏ hơn hoặc bằng)',
};

interface ThresholdFormDialogProps {
  open: boolean;
  onClose: () => void;
  /** Existing threshold for edit mode */
  threshold?: IAlertThreshold | null;
}

export function ThresholdFormDialog({ open, onClose, threshold }: ThresholdFormDialogProps) {
  const createThreshold = useCreateThreshold();
  const updateThreshold = useUpdateThreshold();
  const isEdit = !!threshold;

  // Form state
  const [type, setType] = useState<AlertType>(threshold?.type || AlertType.AIR_QUALITY);
  const [metric, setMetric] = useState<AlertMetric>(threshold?.metric || AlertMetric.AQI);
  const [operator, setOperator] = useState<ThresholdOperator>(
    threshold?.operator || ThresholdOperator.GT,
  );
  const [value, setValue] = useState(threshold?.value?.toString() || '');
  const [level, setLevel] = useState<AlertLevel>(threshold?.level || AlertLevel.HIGH);
  const [adviceTemplate, setAdviceTemplate] = useState(threshold?.adviceTemplate || '');
  const [isActive, setIsActive] = useState(threshold?.isActive ?? true);

  // Reset form when dialog opens with different threshold
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onClose();
    }
  };

  const handleSubmit = async () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      return;
    }

    if (isEdit && threshold) {
      const data: IUpdateAlertThresholdRequest = {
        type,
        metric,
        operator,
        value: numValue,
        level,
        adviceTemplate,
        isActive,
      };

      try {
        await updateThreshold.mutateAsync({ id: threshold.id, data });
        onClose();
      } catch {
        // Error handled by API client
      }
    } else {
      const data: ICreateAlertThresholdRequest = {
        type,
        metric,
        operator,
        value: numValue,
        level,
        adviceTemplate,
        isActive,
      };

      try {
        await createThreshold.mutateAsync(data);
        onClose();
      } catch {
        // Error handled by API client
      }
    }
  };

  const isValid = value.trim() && parseFloat(value) >= 0 && adviceTemplate.trim();
  const isPending = createThreshold.isPending || updateThreshold.isPending;

  // Get unit for current metric
  const unit = AlertMetricUnits[metric];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Chỉnh sửa ngưỡng cảnh báo' : 'Tạo ngưỡng cảnh báo mới'}
          </DialogTitle>
          <DialogDescription>
            Thiết lập ngưỡng để hệ thống tự động gửi cảnh báo khi các chỉ số vượt ngưỡng
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Type and Metric row */}
          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="metric">Chỉ số theo dõi</Label>
              <Select value={metric} onValueChange={(v) => setMetric(v as AlertMetric)}>
                <SelectTrigger id="metric">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AlertMetric).map((m) => (
                    <SelectItem key={m} value={m}>
                      {AlertMetricLabels[m]} {AlertMetricUnits[m] && `(${AlertMetricUnits[m]})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Operator and Value row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="operator">Điều kiện</Label>
              <Select value={operator} onValueChange={(v) => setOperator(v as ThresholdOperator)}>
                <SelectTrigger id="operator">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ThresholdOperator).map((op) => (
                    <SelectItem key={op} value={op}>
                      {OperatorLabels[op]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Giá trị ngưỡng {unit && `(${unit})`}</Label>
              <Input
                id="value"
                type="number"
                min="0"
                step="0.1"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Nhập giá trị..."
              />
            </div>
          </div>

          {/* Alert Level */}
          <div className="space-y-2">
            <Label htmlFor="level">Mức độ cảnh báo khi vượt ngưỡng</Label>
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

          {/* Advice Template */}
          <div className="space-y-2">
            <Label htmlFor="adviceTemplate">Mẫu lời khuyên *</Label>
            <Textarea
              id="adviceTemplate"
              value={adviceTemplate}
              onChange={(e) => setAdviceTemplate(e.target.value)}
              placeholder="Nhập lời khuyên sẽ gửi kèm cảnh báo..."
              rows={3}
            />
            <p className="text-xs text-slate-500">
              Lời khuyên này sẽ được gửi kèm trong cảnh báo tự động
            </p>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isActive" className="font-normal">
              Kích hoạt ngưỡng này
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? 'Cập nhật' : 'Tạo mới'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
