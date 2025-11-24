import { NotificationDropdown } from '@/components/ui/notification-dropdown';

interface NotificationButtonProps {
  onViewAll: () => void;
}

export function NotificationButton({ onViewAll }: NotificationButtonProps) {
  return <NotificationDropdown onViewAll={onViewAll} />;
}
