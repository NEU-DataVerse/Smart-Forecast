'use client';

import { Download, FileText, FileSpreadsheet, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useReportExport } from '@/hooks/useReportExport';
import { ReportType, ExportFormat } from '@/types/dto/report.dto';

interface ExportReportButtonProps {
  reportType: ReportType;
  /** Custom class name */
  className?: string;
  /** Variant of the button */
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  /** Size of the button */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** Show dropdown or just single button */
  showDropdown?: boolean;
  /** Default format for single button mode */
  defaultFormat?: ExportFormat;
  /** Additional params to pass to export */
  exportParams?: {
    startDate?: string;
    endDate?: string;
    stationId?: string;
    limit?: number;
  };
  /** Callback when export starts */
  onExportStart?: () => void;
  /** Callback when export completes */
  onExportComplete?: () => void;
}

export function ExportReportButton({
  reportType,
  className,
  variant = 'outline',
  size = 'sm',
  showDropdown = true,
  defaultFormat = ExportFormat.PDF,
  exportParams = {},
  onExportStart,
  onExportComplete,
}: ExportReportButtonProps) {
  const { mutateAsync: exportReport, isPending } = useReportExport();

  const handleExport = async (format: ExportFormat) => {
    onExportStart?.();
    try {
      await exportReport({
        type: reportType,
        params: {
          format,
          ...exportParams,
        },
      });
      onExportComplete?.();
    } catch {
      // Error is handled by the hook
    }
  };

  if (!showDropdown) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => handleExport(defaultFormat)}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        {isPending ? 'Đang xuất...' : 'Xuất báo cáo'}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className} disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {isPending ? 'Đang xuất...' : 'Xuất báo cáo'}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport(ExportFormat.PDF)} disabled={isPending}>
          <FileText className="mr-2 h-4 w-4 text-red-500" />
          Xuất PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport(ExportFormat.CSV)} disabled={isPending}>
          <FileSpreadsheet className="mr-2 h-4 w-4 text-green-500" />
          Xuất CSV
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="text-xs text-muted-foreground">
          Sử dụng nút &quot;Xuất nâng cao&quot; để lọc dữ liệu
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
