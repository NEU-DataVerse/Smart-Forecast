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
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'weather', label: 'Weather Details', icon: Cloud },
  { id: 'air-quality', label: 'Air Quality', icon: Wind },
  { id: 'disastermap', label: 'Disaster Map', icon: Map },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'stations', label: 'Stations', icon: Satellite },
];
