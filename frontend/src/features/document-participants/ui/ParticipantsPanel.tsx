import { Button } from '@/shared/ui/button';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ParticipantCard } from './ParticipantCard';
import { useCurrentUser } from '@/entities/user/api/queries.ts';
import { Skeleton } from '@/shared/ui/skeleton.tsx';
import { useParticipants } from '@/features/document-participants';
import type { ParticipantResponseDto, ParticipantRole } from '@/shared/api/model';
import { useDocumentOwner } from '@/features/document-owner';
import { useChangeParticipantRole } from '@/features/document-participants';
import { useRemoveParticipant } from '@/entities/participant/api/queries.ts';
import { useLeaveDocument } from '@/features/document-participants';
import { InviteParticipantButton } from '@/features/invitations';

type ParticipantsPanelProps = {
  documentId: string;
  isOpen: boolean;
  toggleOpen: () => void;
};

const pluralizePeople = (count: number): string => {
  const abs = Math.abs(count);
  const lastTwo = abs % 100;
  const lastOne = abs % 10;

  if (lastTwo >= 11 && lastTwo <= 14) return 'человек';
  if (lastOne === 1) return 'человек';
  if (lastOne >= 2 && lastOne <= 4) return 'человека';
  return 'человек';
};

type ParticipantsSectionProps = {
  online: boolean;
  participants: ParticipantResponseDto[];
  currentUserId: string;
  canManage?: boolean;
  onChangeRole?: (participantId: string, role: ParticipantRole) => void;
  onRemove?: (participantId: string) => void;
  onLeave?: (participantId: string) => void;
};

const ParticipantsSection = ({
  online,
  participants,
  currentUserId,
  canManage,
  onChangeRole,
  onRemove,
  onLeave,
}: ParticipantsSectionProps) => {
  if (participants.length === 0) return null;

  return (
    <section className="last:mb-0">
      <div className="flex flex-col gap-1">
        {participants.map((participant) => (
          <ParticipantCard
            key={participant.id}
            participant={participant}
            currentUserId={currentUserId}
            isOnline={online}
            canManage={canManage}
            onChangeRole={onChangeRole}
            onRemove={onRemove}
            onLeave={onLeave}
          />
        ))}
      </div>
    </section>
  );
};

export const ParticipantsPanel = ({ documentId, isOpen, toggleOpen }: ParticipantsPanelProps) => {
  const { onlineParticipants, offlineParticipants, isPending } = useParticipants(documentId);
  const { data: currentUser } = useCurrentUser();
  const { isOwner } = useDocumentOwner(documentId);
  const navigate = useNavigate();

  const changeRoleMutation = useChangeParticipantRole(documentId);
  const removeMutation = useRemoveParticipant(documentId);
  const leaveMutation = useLeaveDocument(documentId);

  if (!isOpen) return null;

  const total = onlineParticipants.length + offlineParticipants.length;

  const handleLeave = (participantId: string) => {
    navigate('/documents', { replace: true });
    leaveMutation.mutate(participantId);
  };

  const sectionProps = currentUser
    ? {
        currentUserId: currentUser.id,
        canManage: isOwner,
        onChangeRole: (participantId: string, role: ParticipantRole) =>
          changeRoleMutation.mutate({ participantId, role }),
        onRemove: (participantId: string) => removeMutation.mutate(participantId),
        onLeave: handleLeave,
      }
    : null;

  return (
    <aside className="absolute inset-y-0 right-0 z-20 flex w-80 flex-col border-l bg-background shadow-xl dark:border-zinc-800">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <div>
          <h2 className="text-sm font-semibold">Участники</h2>
          {isPending ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            <p className="text-xs text-text">
              {total} {pluralizePeople(total)} · {onlineParticipants.length} онлайн
            </p>
          )}
        </div>
        <Button variant="ghost" onClick={toggleOpen}>
          <X />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {isPending || !sectionProps ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <>
            <ParticipantsSection online participants={onlineParticipants} {...sectionProps} />
            <ParticipantsSection online={false} participants={offlineParticipants} {...sectionProps} />
          </>
        )}

        {isOwner && <InviteParticipantButton documentId={documentId} />}
      </div>
    </aside>
  );
};
