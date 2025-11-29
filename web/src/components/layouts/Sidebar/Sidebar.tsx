import { Navigation } from './Navigation';
import { menuItems } from './menuConfig';

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <aside
      className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-56 bg-white border-r border-slate-200 overflow-y-auto"
      role="complementary"
      aria-label="Sidebar navigation"
    >
      <Navigation items={menuItems} />
    </aside>
  );
}
