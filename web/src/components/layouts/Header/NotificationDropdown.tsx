import { useState, type ComponentType, type SVGProps } from 'react';
import { Bell, Check, Trash2, FileText, Key, Database, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

interface Notification {
  id: number;
  type: 'system' | 'weather' | 'reports' | 'alerts';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconColor: string;
  iconBg: string;
}

const recentNotifications: Notification[] = [
  {
    id: 1,
    type: 'system',
    title: 'API Key Expiring Soon',
    message: 'OpenWeatherMap API key expires in 7 days',
    timestamp: '5m ago',
    read: false,
    icon: Key,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50',
  },
  {
    id: 2,
    type: 'weather',
    title: 'Severe Thunderstorm Warning',
    message: 'High winds detected in Downtown District',
    timestamp: '12m ago',
    read: false,
    icon: Zap,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-50',
  },
  {
    id: 3,
    type: 'reports',
    title: 'New Disaster Report',
    message: 'Flooding reported on Main Street',
    timestamp: '25m ago',
    read: false,
    icon: FileText,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50',
  },
  {
    id: 4,
    type: 'alerts',
    title: 'Alert Sent Successfully',
    message: 'Flood advisory sent to 2,150 users',
    timestamp: '1h ago',
    read: true,
    icon: Bell,
    iconColor: 'text-green-500',
    iconBg: 'bg-green-50',
  },
  {
    id: 5,
    type: 'system',
    title: 'Data Fetch Error',
    message: 'Failed to fetch AQ data from OpenAQ',
    timestamp: '3h ago',
    read: true,
    icon: Database,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50',
  },
];

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState(recentNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  // Show only first 4 notifications for dropdown
  const displayedNotifications = notifications.slice(0, 4);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] p-0">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200">
          <div>
            <h3 className="text-slate-900">Notifications</h3>
            <p className="text-slate-500 text-xs">{unreadCount} unread</p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-blue-600 hover:text-blue-700 h-7"
            >
              <Check className="h-3 w-3 mr-1" />
              <span className="text-xs">Mark all</span>
            </Button>
          )}
        </div>

        <ScrollArea className="h-80">
          {displayedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <Bell className="h-10 w-10 text-slate-300 mb-2" />
              <p className="text-slate-500 text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {displayedNotifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`px-4 py-2.5 hover:bg-slate-50 transition-colors ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`${notification.iconBg} p-1.5 rounded-lg shrink-0`}>
                        <Icon className={`h-3.5 w-3.5 ${notification.iconColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-slate-900 text-sm line-clamp-1 flex items-center gap-1.5">
                            {notification.title}
                            {!notification.read && (
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                            )}
                          </h4>
                        </div>

                        <p className="text-slate-600 text-xs line-clamp-1 mb-1.5">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-xs">{notification.timestamp}</span>

                          <div className="flex gap-0.5">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-slate-200 px-4 py-2.5">
          <Link
            href="/notifications"
            className="w-full h-8 cursor-pointer flex items-center justify-center text-sm text-blue-600 hover:text-blue-700"
          >
            View All Notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
