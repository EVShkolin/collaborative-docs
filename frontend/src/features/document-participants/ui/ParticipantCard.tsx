import type { ParticipantResponseDto } from '@/shared/api/model';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/shared/ui/item.tsx';
import { UserAvatar } from '@/entities/user/ui/UserAvatar.tsx';

type ParticipantCardProps = {
  participant: ParticipantResponseDto;
  isOnline?: boolean;
  currentUserId: string;
};

const roles = {
  viewer: 'Читатель',
  commenter: 'Комментатор',
  editor: 'Редактор',
  owner: 'Владелец',
} as const;

export const ParticipantCard = ({ participant, isOnline = false, currentUserId }: ParticipantCardProps) => {
  return (
    <Item className="hover:bg-muted flex h-13 flex-row items-center gap-3 rounded-md px-3 py-0">
      <ItemMedia className="pt-[7px]">
        <UserAvatar name={participant.user.name} avatarUrl={participant.user.avatarUrl} isOnline={isOnline} />
      </ItemMedia>

      <ItemContent className="flex min-w-0 flex-col justify-center gap-0.5">
        <ItemTitle className="flex items-center gap-1 leading-tight">
          {participant.user.name}
          {participant.user.id === currentUserId && (
            <span className="font-normal text-muted-foreground text-xs">(вы)</span>
          )}
        </ItemTitle>
        <ItemDescription className="leading-tight text-xs">{roles[participant.role]}</ItemDescription>
      </ItemContent>
    </Item>
  );
};
