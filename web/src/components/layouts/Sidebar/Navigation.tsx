import { useRouter } from 'next/navigation';
import { NavigationItem } from './NavigationItem';
import { MenuItem } from './types';

interface NavigationProps {
  items: MenuItem[];
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navigation({ items, currentPage, onPageChange }: NavigationProps) {
  const router = useRouter();

  const handleItemClick = (item: MenuItem) => {
    onPageChange(item.id);
    const path = item.id === 'dashboard' ? '/dashboard' : `/dashboard/${item.id}`;
    router.push(path);
  };

  return (
    <nav className="p-3 space-y-1" role="navigation" aria-label="Main navigation">
      {items.map((item) => (
        <NavigationItem
          key={item.id}
          item={item}
          isActive={currentPage === item.id}
          onClick={() => handleItemClick(item)}
        />
      ))}
    </nav>
  );
}
