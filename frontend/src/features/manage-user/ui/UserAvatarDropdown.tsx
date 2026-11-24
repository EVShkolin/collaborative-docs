import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu.tsx';
import { UserAvatar } from '@/entities/user/ui/UserAvatar.tsx';
import { LogOut, UserRoundPen } from 'lucide-react';
import { Button } from '@/shared/ui/button.tsx';
import { useState } from 'react';
import { ProfileDialog } from '@/features/manage-user/ui/ProfileDialog.tsx';
import { useAuth } from '@/app/providers/auth/AuthContext.ts';
import { useNavigate } from 'react-router-dom';

export const UserAvatarDropdown = ({ name, avatarUrl }: { name: string; avatarUrl: string | null | undefined }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserAvatar name={name} avatarUrl={avatarUrl} size="lg" />
            </Button>
          }
        />

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
              <UserRoundPen /> Профиль
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <LogOut /> Выйти
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ProfileDialog open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </>
  );
};
