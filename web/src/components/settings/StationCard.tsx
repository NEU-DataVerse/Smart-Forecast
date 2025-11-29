/**
 * Station Card Component
 * Displays individual station information in a card format
 */

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Radio, MapPin, Edit2, Trash2 } from 'lucide-react';
import type { ObservationStation, StationStatus } from '@/types/dto';

interface StationCardProps {
  station: ObservationStation;
  isSelected: boolean;
  onToggleSelect: (stationId: string) => void;
  onEdit: (station: ObservationStation) => void;
  onDelete: (stationId: string) => void;
}

export function StationCard({
  station,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
}: StationCardProps) {
  const getStatusBadgeVariant = (status: StationStatus) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'destructive';
      case 'maintenance':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="bg-slate-50 border-slate-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="pt-1">
              <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect(station.id)} />
            </div>
            <div className="bg-white p-3 rounded-lg">
              <Radio className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-slate-900">{station.name}</h4>
                  <Badge variant={getStatusBadgeVariant(station.status)}>{station.status}</Badge>
                  {station.priority && (
                    <Badge variant="outline" className="text-xs">
                      {station.priority}
                    </Badge>
                  )}
                </div>
                <p className="text-slate-500 text-sm">{station.code}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {station.city ? `${station.city}, ` : ''}
                    {station.district}
                  </span>
                </div>
                <div className="text-slate-600 text-sm">
                  <span>
                    📍 {station.location.lat.toFixed(4)}, {station.location.lon.toFixed(4)}
                  </span>
                </div>
              </div>

              {station.categories && station.categories.length > 0 && (
                <div className="space-y-1">
                  <p className="text-slate-500 text-xs">Categories:</p>
                  <div className="flex flex-wrap gap-1">
                    {station.categories.map((category) => (
                      <Badge key={category} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button variant="outline" size="sm" onClick={() => onEdit(station)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(station.id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
