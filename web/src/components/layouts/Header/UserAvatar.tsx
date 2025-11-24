import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface UserAvatarProps {
  fullName?: string;
  className?: string;
}

export function UserAvatar({ fullName, className = '' }: UserAvatarProps) {
  const initials =
    fullName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'AD';

  return (
    <Avatar className={className}>
      <AvatarFallback className="bg-blue-500 text-white text-xs">{initials}</AvatarFallback>
    </Avatar>
  );
}
