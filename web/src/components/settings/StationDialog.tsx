'use client';

/**
 * Station Dialog Component
 * Modal dialog for creating and editing stations
 */

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { StationForm, type StationFormData } from './StationForm';
import type { ObservationStation } from '@/types/dto';

interface StationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingStation: ObservationStation | null;
  formData: StationFormData;
  onFormChange: (formData: StationFormData) => void;
  onMapLocationSelect: (lat: number, lng: number) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function StationDialog({
  open,
  onOpenChange,
  editingStation,
  formData,
  onFormChange,
  onMapLocationSelect,
  onSave,
  onCancel,
}: StationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingStation ? 'Edit Station' : 'Add New Station'}</DialogTitle>
          <DialogDescription>
            {editingStation
              ? 'Update station details and location'
              : 'Enter station details and select location on map'}
          </DialogDescription>
        </DialogHeader>

        <StationForm
          formData={formData}
          onChange={onFormChange}
          onMapLocationSelect={onMapLocationSelect}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={onSave} disabled={!formData.name || !formData.district}>
            {editingStation ? 'Update Station' : 'Create Station'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
