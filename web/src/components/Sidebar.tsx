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
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isOpen: boolean;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'weather', label: 'Weather Details', icon: Cloud },
  { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  { id: 'disastermap', label: 'Disaster Map', icon: Map },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ currentPage, setCurrentPage, isOpen }: SidebarProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-56 bg-white border-r border-slate-200 overflow-y-auto">
      <nav className="p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                router.push(
                  `/dashboard/${item.id === 'dashboard' ? '' : item.id}`
                );
              }}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-sm',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
