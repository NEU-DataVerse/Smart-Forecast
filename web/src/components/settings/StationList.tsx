/**
 * Station List Component
 * Displays list of stations with batch operations
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Activity, Trash2, Wrench } from 'lucide-react';
import { StationCard } from './StationCard';
import type { ObservationStation } from '@/types/dto';

interface StationListProps {
  stations: ObservationStation[];
  loading: boolean;
  selectedStations: string[];
  currentPage: number;
  itemsPerPage: number;
  onToggleSelect: (stationId: string) => void;
  onToggleSelectAll: () => void;
  onEdit: (station: ObservationStation) => void;
  onDelete: (stationId: string) => void;
  onAdd: () => void;
  onBatchActivate: () => void;
  onBatchDeactivate: () => void;
  onBatchMaintenance: () => void;
  onBatchDelete: () => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export function StationList({
  stations,
  loading,
  selectedStations,
  currentPage,
  itemsPerPage,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
  onAdd,
  onBatchActivate,
  onBatchDeactivate,
  onBatchMaintenance,
  onBatchDelete,
  onNextPage,
  onPrevPage,
}: StationListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Weather Monitoring Stations</CardTitle>
            <CardDescription>
              Manage weather data collection stations and their configurations
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {selectedStations.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBatchActivate}
                  className="text-green-600"
                >
                  <Activity className="h-4 w-4 mr-1" />
                  Activate ({selectedStations.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBatchDeactivate}
                  className="text-orange-600"
                >
                  Deactivate ({selectedStations.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBatchMaintenance}
                  className="text-yellow-600"
                >
                  <Wrench className="h-4 w-4 mr-1" />
                  Maintenance ({selectedStations.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBatchDelete}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete ({selectedStations.length})
                </Button>
              </>
            )}
            <Button onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Station
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Select All */}
        {stations.length > 0 && (
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Checkbox
              checked={selectedStations.length === stations.length && stations.length > 0}
              onCheckedChange={onToggleSelectAll}
            />
            <Label className="text-sm text-slate-600 cursor-pointer" onClick={onToggleSelectAll}>
              Select All ({selectedStations.length} of {stations.length})
            </Label>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-slate-500">Loading stations...</div>
        ) : stations.length === 0 ? (
          <div className="text-center py-8 text-slate-500">No stations found</div>
        ) : (
          <div className="space-y-3">
            {stations.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                isSelected={selectedStations.includes(station.id)}
                onToggleSelect={onToggleSelect}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {stations.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Page {currentPage} • Showing {stations.length} stations
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onPrevPage} disabled={currentPage === 1}>
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onNextPage}
                disabled={stations.length < itemsPerPage}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
