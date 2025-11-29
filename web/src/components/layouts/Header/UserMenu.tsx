import { useUserContext } from '@/context/userContext';
import { UserAvatar } from './UserAvatar';
import { UserMenuDropdown } from './UserMenuDropdown';

export function UserMenu() {
  const { user } = useUserContext();

  return (
    <UserMenuDropdown>
      <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
        <UserAvatar fullName={user?.fullName} className="h-7 w-7" />
        <div className="text-left hidden lg:block">
          <div className="text-slate-900 text-xs">{user?.fullName || 'Admin User'}</div>
          <div className="text-slate-500 text-xs">{user?.email || 'admin@weather.system'}</div>
        </div>
      </button>
    </UserMenuDropdown>
  );
}
