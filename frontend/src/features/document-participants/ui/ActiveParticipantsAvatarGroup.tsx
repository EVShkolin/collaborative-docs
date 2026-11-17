import { useParticipants } from '@/features/document-participants/hook/useParticipants.ts';
import { AvatarGroup, AvatarGroupCount } from '@/shared/ui/avatar.tsx';
import { UserAvatar } from '@/entities/user/ui/UserAvatar.tsx';

export const ActiveParticipantsAvatarGroup = ({ documentId }: { documentId: string }) => {
  const { onlineParticipants } = useParticipants(documentId);

  return (
    <AvatarGroup>
      {onlineParticipants?.slice(0, 3).map((p) => (
        <UserAvatar name={p.user.name} avatarUrl={p.user.avatarUrl} />
      ))}
      {onlineParticipants && onlineParticipants.length > 3 && (
        <AvatarGroupCount>+{onlineParticipants.length - 3}</AvatarGroupCount>
      )}
    </AvatarGroup>
  );
};
