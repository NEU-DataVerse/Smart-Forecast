'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { incidentKeys } from '@/hooks/useIncidentQuery';

export function ReportHeader() {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: incidentKeys.all });
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Báo cáo sự cố</h2>
        <p className="text-slate-500">Quản lý báo cáo từ người dùng mobile app</p>
      </div>
      <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Làm mới
      </Button>
    </div>
  );
}
