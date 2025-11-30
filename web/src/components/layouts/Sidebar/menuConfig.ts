import {
  LayoutDashboard,
  Cloud,
  Wind,
  Map,
  FileText,
  AlertTriangle,
  Satellite,
} from 'lucide-react';
import { MenuItem } from './types';

export const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
  { id: 'weather', label: 'Thời tiết', icon: Cloud },
  { id: 'air-quality', label: 'Chất lượng không khí', icon: Wind },
  { id: 'disastermap', label: 'Bản đồ thiên tai', icon: Map },
  { id: 'reports', label: 'Báo cáo', icon: FileText },
  { id: 'alerts', label: 'Cảnh báo', icon: AlertTriangle },
  { id: 'stations', label: 'Trạm quan trắc', icon: Satellite },
];
