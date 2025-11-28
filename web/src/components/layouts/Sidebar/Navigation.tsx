import { usePathname, useRouter } from 'next/navigation';
import { NavigationItem } from './NavigationItem';
import { MenuItem } from './types';

interface NavigationProps {
  items: MenuItem[];
}

export function Navigation({ items }: NavigationProps) {
  const currentPage = usePathname();
  const router = useRouter();

  const handleItemClick = (item: MenuItem) => {
    const path = item.id;
    router.push(path);
  };

  return (
    <nav className="p-3 space-y-1" role="navigation" aria-label="Main navigation">
      {items.map((item) => (
        <NavigationItem
          key={item.id}
          item={item}
          isActive={currentPage === `/${item.id}`}
          onClick={() => handleItemClick(item)}
        />
      ))}
    </nav>
  );
}
