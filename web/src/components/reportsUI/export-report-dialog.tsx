'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Download, FileText, FileSpreadsheet, CalendarIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useReportExport } from '@/hooks/useReportExport';
import {
  ReportType,
  ReportTypeLabels,
  ExportFormat,
  ExportFormatLabels,
  REPORT_LIMITS,
} from '@/types/dto/report.dto';

interface ExportReportDialogProps {
  reportType: ReportType;
  /** Whether to show date range filter (not applicable for stations) */
  showDateRange?: boolean;
  /** Whether to show station filter (only for weather/air-quality) */
  showStationFilter?: boolean;
  /** Available stations for filter */
  stations?: Array<{ id: string; name: string }>;
  /** Custom trigger button */
  trigger?: React.ReactNode;
  /** Default start date */
  defaultStartDate?: string;
  /** Default end date */
  defaultEndDate?: string;
}

export function ExportReportDialog({
  reportType,
  showDateRange = true,
  showStationFilter = false,
  stations = [],
  trigger,
  defaultStartDate,
  defaultEndDate,
}: ExportReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>(ExportFormat.PDF);
  const [startDate, setStartDate] = useState<Date | undefined>(
    defaultStartDate ? new Date(defaultStartDate) : undefined,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    defaultEndDate ? new Date(defaultEndDate) : undefined,
  );
  const [stationId, setStationId] = useState<string>('');
  const [limit, setLimit] = useState<number>(REPORT_LIMITS.DEFAULT);

  const { mutateAsync: exportReport, isPending } = useReportExport();

  // Disable date range for stations report
  const shouldShowDateRange = showDateRange && reportType !== ReportType.STATIONS;
  // Disable station filter for incidents and stations reports
  const shouldShowStationFilter =
    showStationFilter && reportType !== ReportType.INCIDENTS && reportType !== ReportType.STATIONS;

  const handleExport = async () => {
    const params: Record<string, unknown> = {
      format: exportFormat,
      limit,
    };

    // Add date range if applicable
    if (shouldShowDateRange) {
      if (startDate) {
        params.startDate = format(startDate, 'yyyy-MM-dd');
      }
      if (endDate) {
        params.endDate = format(endDate, 'yyyy-MM-dd');
      }
    }

    // Add station filter if applicable
    if (shouldShowStationFilter && stationId) {
      params.stationId = stationId;
    }

    try {
      await exportReport({ type: reportType, params });
      setOpen(false);
    } catch {
      // Error is handled by the hook
    }
  };

  const resetForm = () => {
    setExportFormat(ExportFormat.PDF);
    setStartDate(defaultStartDate ? new Date(defaultStartDate) : undefined);
    setEndDate(defaultEndDate ? new Date(defaultEndDate) : undefined);
    setStationId('');
    setLimit(REPORT_LIMITS.DEFAULT);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Xuất báo cáo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xuất báo cáo {ReportTypeLabels[reportType]}</DialogTitle>
          <DialogDescription>
            Chọn định dạng và các tùy chọn lọc dữ liệu cho báo cáo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Export Format */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="format" className="text-right">
              Định dạng
            </Label>
            <Select
              value={exportFormat}
              onValueChange={(value) => setExportFormat(value as ExportFormat)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn định dạng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ExportFormat.PDF}>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-500" />
                    {ExportFormatLabels[ExportFormat.PDF]}
                  </div>
                </SelectItem>
                <SelectItem value={ExportFormat.CSV}>
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-500" />
                    {ExportFormatLabels[ExportFormat.CSV]}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range - Start Date */}
          {shouldShowDateRange && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Từ ngày</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'col-span-3 justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      locale={vi}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date Range - End Date */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Đến ngày</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'col-span-3 justify-start text-left font-normal',
                        !endDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => (startDate ? date < startDate : false)}
                      locale={vi}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}

          {/* Station Filter */}
          {shouldShowStationFilter && stations.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Trạm</Label>
              <Select value={stationId} onValueChange={setStationId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Tất cả trạm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả trạm</SelectItem>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Limit */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="limit" className="text-right">
              Số bản ghi
            </Label>
            <Input
              id="limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(Math.min(REPORT_LIMITS.MAX, Number(e.target.value)))}
              min={1}
              max={REPORT_LIMITS.MAX}
              className="col-span-3"
            />
          </div>

          {/* Info text */}
          <p className="text-xs text-muted-foreground text-center">
            {exportFormat === ExportFormat.PDF
              ? `Báo cáo PDF hiển thị tối đa ${REPORT_LIMITS.PDF_MAX_DISPLAY} bản ghi.`
              : `Tối đa ${REPORT_LIMITS.MAX.toLocaleString()} bản ghi.`}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Hủy
          </Button>
          <Button onClick={handleExport} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xuất...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Xuất báo cáo
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
