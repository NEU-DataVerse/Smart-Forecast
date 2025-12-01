'use client';

/**
 * Station Form Component
 * Form for creating and editing stations
 */

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPicker } from '@/components/ui/map-picker';
import type { StationPriority } from '@/types/dto';

export interface StationFormData {
  name: string;
  city: string;
  district: string;
  ward: string;
  lat: number;
  lng: number;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  addressCountry: string;
  postalCode: string;
  priority: StationPriority;
  categories: string[];
}

interface StationFormProps {
  formData: StationFormData;
  onChange: (formData: StationFormData) => void;
  onMapLocationSelect: (lat: number, lng: number) => void;
}

export function StationForm({ formData, onChange, onMapLocationSelect }: StationFormProps) {
  const updateField = (field: keyof StationFormData, value: string | number | StationPriority) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <div className="space-y-2">
        <Label>Tên trạm *</Label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="Ví dụ: Trạm quan trắc Hoàn Kiếm"
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Thành phố</Label>
          <Input
            type="text"
            value={formData.city}
            onChange={(e) => updateField('city', e.target.value)}
            placeholder="Ví dụ: Hà Nội"
            className="mt-1"
          />
        </div>
        <div className="space-y-2">
          <Label>Quận/Huyện *</Label>
          <Input
            type="text"
            value={formData.district}
            onChange={(e) => updateField('district', e.target.value)}
            placeholder="Ví dụ: Hoàn Kiếm"
            className="mt-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Phường/Xã</Label>
        <Input
          type="text"
          value={formData.ward}
          onChange={(e) => updateField('ward', e.target.value)}
          placeholder="Ví dụ: Hàng Bạc"
          className="mt-1"
        />
      </div>

      {/* Map Location Picker */}
      <div className="space-y-2">
        <Label>Vị trí (Nhấp vào bản đồ hoặc kéo điểm đánh dấu)</Label>
        <MapPicker
          initialLat={formData.lat}
          initialLng={formData.lng}
          onLocationSelect={onMapLocationSelect}
          height="300px"
        />
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
          <div>Vĩ độ: {formData.lat.toFixed(6)}</div>
          <div>Kinh độ: {formData.lng.toFixed(6)}</div>
        </div>
      </div>

      {/* Address Details */}
      <div className="space-y-2">
        <Label>Địa chỉ</Label>
        <Input
          type="text"
          value={formData.streetAddress}
          onChange={(e) => updateField('streetAddress', e.target.value)}
          placeholder="e.g., Hồ Hoàn Kiếm"
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Địa phương *</Label>
          <Input
            type="text"
            value={formData.addressLocality}
            onChange={(e) => updateField('addressLocality', e.target.value)}
            placeholder="Ví dụ: Hoàn Kiếm"
            className="mt-1"
          />
        </div>
        <div className="space-y-2">
          <Label>Vùng miền</Label>
          <Input
            type="text"
            value={formData.addressRegion}
            onChange={(e) => updateField('addressRegion', e.target.value)}
            placeholder="Ví dụ: Hà Nội"
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Mã quốc gia</Label>
          <Input
            type="text"
            value={formData.addressCountry}
            onChange={(e) => updateField('addressCountry', e.target.value)}
            placeholder="VN"
            className="mt-1"
          />
        </div>
        <div className="space-y-2">
          <Label>Mã bưu chính</Label>
          <Input
            type="text"
            value={formData.postalCode}
            onChange={(e) => updateField('postalCode', e.target.value)}
            placeholder="100000"
            className="mt-1"
          />
        </div>
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <Label>Mức độ ưu tiên</Label>
        <select
          value={formData.priority}
          onChange={(e) => updateField('priority', e.target.value as StationPriority)}
          className="w-full px-3 py-2 border border-slate-200 rounded-md"
        >
          <option value="high">Cao</option>
          <option value="medium">Trung bình</option>
          <option value="low">Thấp</option>
        </select>
      </div>
    </div>
  );
}
