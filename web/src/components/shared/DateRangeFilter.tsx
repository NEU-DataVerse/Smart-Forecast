'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DateRangeFilterProps {
  onDateRangeChange: (startDate: string, endDate: string) => void;
}

export function DateRangeFilter({ onDateRangeChange }: DateRangeFilterProps) {
  const [preset, setPreset] = useState<'today' | '7days' | '30days' | 'custom'>('7days');
  const [customStart, setCustomStart] = useState<Date>();
  const [customEnd, setCustomEnd] = useState<Date>();
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const handlePresetChange = (newPreset: 'today' | '7days' | '30days') => {
    setPreset(newPreset);
    setCustomStart(undefined);
    setCustomEnd(undefined);
    const now = new Date();
    const end = now.toISOString();
    let start: string;

    switch (newPreset) {
      case 'today':
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        start = startOfDay.toISOString();
        break;
      case '7days':
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        start = sevenDaysAgo.toISOString();
        break;
      case '30days':
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        start = thirtyDaysAgo.toISOString();
        break;
    }

    onDateRangeChange(start, end);
  };

  const handleStartSelect = (date: Date | undefined) => {
    if (!date) return;
    setCustomStart(date);
    setStartOpen(false);
    if (customEnd) {
      setPreset('custom');
      onDateRangeChange(date.toISOString(), customEnd.toISOString());
    }
  };

  const handleEndSelect = (date: Date | undefined) => {
    if (!date) return;
    setCustomEnd(date);
    setEndOpen(false);
    if (customStart) {
      setPreset('custom');
      onDateRangeChange(customStart.toISOString(), date.toISOString());
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Preset buttons */}
      <Button
        variant={preset === 'today' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handlePresetChange('today')}
      >
        Hôm nay
      </Button>
      <Button
        variant={preset === '7days' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handlePresetChange('7days')}
      >
        7 ngày qua
      </Button>
      <Button
        variant={preset === '30days' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handlePresetChange('30days')}
      >
        30 ngày qua
      </Button>

      {/* Separator */}
      <div className="h-6 w-px bg-slate-200 mx-1" />

      {/* Date inputs */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Từ</span>
        <Popover open={startOpen} onOpenChange={setStartOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'w-[130px] justify-start text-left font-normal',
                !customStart && 'text-muted-foreground',
                preset === 'custom' && customStart && 'border-primary',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {customStart ? format(customStart, 'dd/MM/yyyy') : 'Chọn ngày'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
            <div className="p-3">
              <Calendar
                mode="single"
                selected={customStart}
                onSelect={handleStartSelect}
                locale={vi}
                disabled={(date) => (customEnd ? date > customEnd : false)}
                defaultMonth={customStart || new Date()}
              />
            </div>
          </PopoverContent>
        </Popover>

        <span className="text-sm text-slate-500">đến</span>
        <Popover open={endOpen} onOpenChange={setEndOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'w-[130px] justify-start text-left font-normal',
                !customEnd && 'text-muted-foreground',
                preset === 'custom' && customEnd && 'border-primary',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {customEnd ? format(customEnd, 'dd/MM/yyyy') : 'Chọn ngày'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
            <div className="p-3">
              <Calendar
                mode="single"
                selected={customEnd}
                onSelect={handleEndSelect}
                locale={vi}
                disabled={(date) => (customStart ? date < customStart : false)}
                defaultMonth={customEnd || customStart || new Date()}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
