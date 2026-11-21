import type { ParticipantResponseDto, ParticipantRole } from '@/shared/api/model';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/shared/ui/item.tsx';
import { UserAvatar } from '@/entities/user/ui/UserAvatar.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu.tsx';
import { Button } from '@/shared/ui/button.tsx';
import { LogOut, MoreHorizontal, Trash } from 'lucide-react';

type ParticipantCardProps = {
  participant: ParticipantResponseDto;
  isOnline?: boolean;
  currentUserId: string;
  canManage?: boolean;
  onChangeRole?: (participantId: string, role: ParticipantRole) => void;
  onRemove?: (participantId: string) => void;
  onLeave?: (participantId: string) => void;
};

const roles = {
  viewer: 'Читатель',
  commenter: 'Комментатор',
  editor: 'Редактор',
  owner: 'Владелец',
} as const;

const assignableRoles: Exclude<ParticipantRole, 'owner'>[] = ['viewer', 'commenter', 'editor'];

export const ParticipantCard = ({
  participant,
  isOnline = false,
  currentUserId,
  canManage = false,
  onChangeRole,
  onRemove,
  onLeave,
}: ParticipantCardProps) => {
  const isSelf = participant.user.id === currentUserId;

  const showManageMenu = canManage && !isSelf;
  const showLeaveMenu = !canManage && isSelf;

  return (
    <Item className="group hover:bg-muted flex h-13 flex-row items-center gap-3 rounded-md px-3 py-0">
      <ItemMedia className="pt-[7px]">
        <UserAvatar name={participant.user.name} avatarUrl={participant.user.avatarUrl} isOnline={isOnline} />
      </ItemMedia>

      <ItemContent className="flex min-w-0 flex-col justify-center gap-0.5">
        <ItemTitle className="flex items-center gap-1 leading-tight">
          {participant.user.name}
          {isSelf && <span className="font-normal text-muted-foreground text-xs">(вы)</span>}
        </ItemTitle>
        <ItemDescription className="leading-tight text-xs">{roles[participant.role]}</ItemDescription>
      </ItemContent>

      {showManageMenu && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="w-10 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
              >
                <MoreHorizontal size={18} />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Изменить роль</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {assignableRoles.map((role) => (
                    <DropdownMenuItem
                      key={role}
                      disabled={participant.role === role}
                      onClick={() => onChangeRole?.(participant.id, role)}
                    >
                      {roles[role]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" onClick={() => onRemove?.(participant.id)}>
                <Trash /> Удалить
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {showLeaveMenu && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="w-10 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
              >
                <MoreHorizontal size={18} />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" onClick={() => onLeave?.(participant.id)}>
                <LogOut /> Выйти из документа
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </Item>
  );
};
