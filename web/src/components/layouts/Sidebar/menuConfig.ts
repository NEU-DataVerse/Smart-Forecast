import {
  LayoutDashboard,
  Cloud,
  BarChart3,
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
  { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  { id: 'disastermap', label: 'Disaster Map', icon: Map },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];
