import { Logo } from './Logo';
import { MenuToggle } from './MenuToggle';
import { NotificationButton } from './NotificationButton';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onNavigate: (page: string) => void;
}

export function Header({ sidebarOpen, setSidebarOpen, onNavigate }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 z-50">
      <div className="flex items-center justify-between h-full px-3">
        <div className="flex items-center gap-3">
          <MenuToggle isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
          <Logo />
        </div>

        <div className="flex items-center gap-2">
          <NotificationButton onViewAll={() => onNavigate('notifications')} />
          <UserMenu onNavigate={onNavigate} />
        </div>
      </div>
    </header>
  );
}
