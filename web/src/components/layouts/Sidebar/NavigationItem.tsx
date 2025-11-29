import { cn } from '@/lib/utils';
import { MenuItem } from './types';

interface NavigationItemProps {
  item: MenuItem;
  isActive: boolean;
  onClick: () => void;
}

export function NavigationItem({ item, isActive, onClick }: NavigationItemProps) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-sm',
        isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50',
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
    </button>
  );
}
