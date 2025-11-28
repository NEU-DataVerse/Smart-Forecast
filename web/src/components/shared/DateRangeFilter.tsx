'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface DateRangeFilterProps {
  onDateRangeChange: (startDate: string, endDate: string) => void;
}

export function DateRangeFilter({ onDateRangeChange }: DateRangeFilterProps) {
  const [preset, setPreset] = useState<'today' | '7days' | '30days' | 'custom'>('7days');
  const [customStart, setCustomStart] = useState<Date>();
  const [customEnd, setCustomEnd] = useState<Date>();

  const handlePresetChange = (newPreset: 'today' | '7days' | '30days') => {
    setPreset(newPreset);
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

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      setPreset('custom');
      onDateRangeChange(customStart.toISOString(), customEnd.toISOString());
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={preset === 'today' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handlePresetChange('today')}
      >
        Today
      </Button>
      <Button
        variant={preset === '7days' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handlePresetChange('7days')}
      >
        Last 7 Days
      </Button>
      <Button
        variant={preset === '30days' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handlePresetChange('30days')}
      >
        Last 30 Days
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant={preset === 'custom' ? 'default' : 'outline'} size="sm">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Custom Range
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="end">
          <div className="space-y-4">
            <div>
              <p className="text-sm mb-2">Start Date</p>
              <Calendar mode="single" selected={customStart} onSelect={setCustomStart} />
            </div>
            <div>
              <p className="text-sm mb-2">End Date</p>
              <Calendar mode="single" selected={customEnd} onSelect={setCustomEnd} />
            </div>
            {customStart && customEnd && (
              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-xs text-slate-500">
                  {format(customStart, 'MMM dd')} - {format(customEnd, 'MMM dd, yyyy')}
                </p>
                <Button size="sm" onClick={handleCustomApply}>
                  Apply
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
