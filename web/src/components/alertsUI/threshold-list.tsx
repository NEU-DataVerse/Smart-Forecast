'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAlertThresholds, useToggleThreshold, useDeleteThreshold } from '@/hooks/useAlertQuery';
import {
  AlertLevel,
  ThresholdOperator,
  AlertLevelLabels,
  AlertLevelColors,
  AlertMetricLabels,
  AlertMetricUnits,
  AlertTypeLabels,
  type IAlertThreshold,
} from '@smart-forecast/shared';
import { ThresholdFormDialog } from './threshold-form-dialog';
import { Loader2, Plus, Pencil, Trash2, AlertTriangle, Settings } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Operator symbols
const OperatorSymbols: Record<ThresholdOperator, string> = {
  [ThresholdOperator.GT]: '>',
  [ThresholdOperator.GTE]: '≥',
  [ThresholdOperator.LT]: '<',
  [ThresholdOperator.LTE]: '≤',
};

export function ThresholdList() {
  const { data: thresholds, isLoading, isError, error, refetch } = useAlertThresholds();
  const toggleThreshold = useToggleThreshold();
  const deleteThreshold = useDeleteThreshold();

  // Dialog states
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editThreshold, setEditThreshold] = useState<IAlertThreshold | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditThreshold(null);
    setShowFormDialog(true);
  };

  const handleEdit = (threshold: IAlertThreshold) => {
    setEditThreshold(threshold);
    setShowFormDialog(true);
  };

  const handleCloseForm = () => {
    setShowFormDialog(false);
    setEditThreshold(null);
  };

  const handleToggle = (id: string) => {
    toggleThreshold.mutate(id);
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      deleteThreshold.mutate(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            <span className="ml-2 text-slate-500">Đang tải ngưỡng cảnh báo...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Không thể tải dữ liệu</h3>
          <p className="text-slate-500 mb-4">
            {error instanceof Error ? error.message : 'Đã xảy ra lỗi'}
          </p>
          <Button onClick={() => refetch()}>Thử lại</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Ngưỡng cảnh báo tự động
              </CardTitle>
              <CardDescription>
                Thiết lập các ngưỡng để hệ thống tự động gửi cảnh báo khi các chỉ số môi trường vượt
                quá giới hạn
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm ngưỡng
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!thresholds || thresholds.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Chưa có ngưỡng nào</h3>
              <p className="text-slate-500 mb-4">
                Tạo ngưỡng cảnh báo để hệ thống tự động theo dõi và gửi thông báo
              </p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo ngưỡng đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {thresholds.map((threshold) => (
                <div
                  key={threshold.id}
                  className={`p-4 border rounded-lg ${
                    threshold.isActive
                      ? 'border-slate-200 bg-white'
                      : 'border-slate-100 bg-slate-50 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="outline">{AlertTypeLabels[threshold.type]}</Badge>
                        <Badge
                          style={{
                            backgroundColor: AlertLevelColors[threshold.level],
                            color: threshold.level === AlertLevel.MEDIUM ? '#000' : '#fff',
                          }}
                        >
                          {AlertLevelLabels[threshold.level]}
                        </Badge>
                        {!threshold.isActive && <Badge variant="secondary">Tạm dừng</Badge>}
                      </div>

                      <div className="text-lg font-medium text-slate-900 mb-1">
                        {AlertMetricLabels[threshold.metric]}{' '}
                        <span className="text-blue-600">
                          {OperatorSymbols[threshold.operator]} {threshold.value}
                        </span>
                        {AlertMetricUnits[threshold.metric] && (
                          <span className="text-slate-500 text-sm ml-1">
                            {AlertMetricUnits[threshold.metric]}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-500 line-clamp-2">
                        {threshold.adviceTemplate}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Switch
                        checked={threshold.isActive}
                        onCheckedChange={() => handleToggle(threshold.id)}
                        disabled={toggleThreshold.isPending}
                      />
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(threshold)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteConfirmId(threshold.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <ThresholdFormDialog
        open={showFormDialog}
        onClose={handleCloseForm}
        threshold={editThreshold}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa ngưỡng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa ngưỡng cảnh báo này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              {deleteThreshold.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
