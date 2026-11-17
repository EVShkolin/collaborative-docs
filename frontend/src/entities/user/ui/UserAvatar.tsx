import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from '@/shared/ui/avatar.tsx';

const getAvatarFallback = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.length > 1 ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase() : parts[0][0].toUpperCase();
};

interface UserAvatarProps {
  name: string;
  avatarUrl: string | null | undefined;
  size?: 'default' | 'sm' | 'lg';
  isOnline?: boolean;
}

export const UserAvatar = ({ name, avatarUrl, size = 'default', isOnline = false }: UserAvatarProps) => {
  return (
    <Avatar size={size}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
      <AvatarFallback>{getAvatarFallback(name)}</AvatarFallback>
      {isOnline && <AvatarBadge className="bg-green-700" />}
    </Avatar>
  );
};
