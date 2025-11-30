import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import { useTriggerCheck } from '@/hooks/useAlertQuery';

interface AlertHeaderProps {
  onCreateClick: () => void;
}

export function AlertHeader({ onCreateClick }: AlertHeaderProps) {
  const triggerCheck = useTriggerCheck();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Quản lý cảnh báo</h2>
        <p className="text-slate-500">Xem và quản lý các cảnh báo đã gửi</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => triggerCheck.mutate()}
          disabled={triggerCheck.isPending}
        >
          {triggerCheck.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Kiểm tra ngưỡng
        </Button>
        <Button onClick={onCreateClick}>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Tạo cảnh báo mới
        </Button>
      </div>
    </div>
  );
}
