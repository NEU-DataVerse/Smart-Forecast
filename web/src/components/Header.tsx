import { Menu, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/userContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { NotificationDropdown } from '@/components/ui/notification-dropdown';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onNavigate: (page: string) => void;
}

export function Header({ sidebarOpen, setSidebarOpen, onNavigate }: HeaderProps) {
  const { logout, user } = useUserContext();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 z-50">
      <div className="flex items-center justify-between h-full px-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 w-8 p-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-sm">
              <span className="text-white">Logo</span>
            </div>
            <h1 className="text-slate-900 text-sm md:text-base">Smart Forecast</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NotificationDropdown onViewAll={() => onNavigate('notifications')} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    {user?.fullName
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase() || 'AD'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden lg:block">
                  <div className="text-slate-900 text-xs">{user?.fullName || 'Admin User'}</div>
                  <div className="text-slate-500 text-xs">
                    {user?.email || 'admin@weather.system'}
                  </div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onNavigate('profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
