'use client';

import { useStations } from '@/hooks/useStations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin } from 'lucide-react';

interface StationSelectorProps {
  value?: string;
  onChange: (stationId: string) => void;
  placeholder?: string;
}

export function StationSelector({
  value,
  onChange,
  placeholder = 'Chọn trạm',
}: StationSelectorProps) {
  const { stations, loading } = useStations({ autoFetch: true });

  return (
    <Select value={value} onValueChange={onChange} disabled={loading}>
      <SelectTrigger className="w-full">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <SelectValue placeholder={loading ? 'Đang tải danh sách trạm...' : placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả các trạm</SelectItem>
        {stations.map((station) => (
          <SelectItem key={station.id} value={station.id}>
            {station.name} - {station.district}, {station.city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
