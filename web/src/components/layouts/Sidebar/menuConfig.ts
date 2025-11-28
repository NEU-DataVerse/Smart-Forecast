import {
  LayoutDashboard,
  Cloud,
  Wind,
  Map,
  FileText,
  AlertTriangle,
  Settings,
  Bell,
} from 'lucide-react';
import { MenuItem } from './types';

export const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'weather', label: 'Weather Details', icon: Cloud },
  { id: 'air-quality', label: 'Air Quality', icon: Wind },
  { id: 'disastermap', label: 'Disaster Map', icon: Map },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];
