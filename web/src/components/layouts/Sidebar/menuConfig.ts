import { LayoutDashboard, Cloud, Wind, AlertTriangle, Satellite, Megaphone } from 'lucide-react';
import { MenuItem } from './types';

export const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
  { id: 'weather', label: 'Thời tiết', icon: Cloud },
  { id: 'air-quality', label: 'Chất lượng không khí', icon: Wind },
  { id: 'incidents', label: 'Báo cáo sự cố', icon: Megaphone },
  { id: 'alerts', label: 'Cảnh báo', icon: AlertTriangle },
  { id: 'stations', label: 'Trạm quan trắc', icon: Satellite },
];
