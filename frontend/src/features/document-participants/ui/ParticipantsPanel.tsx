import { Button } from '@/shared/ui/button';
import { Plus, X } from 'lucide-react';
import { ParticipantCard } from '@/features/document-participants/ui/ParticipantCard.tsx';
import { useCurrentUser } from '@/entities/user/api/queries.ts';
import { Skeleton } from '@/shared/ui/skeleton.tsx';
import { useParticipants } from '@/features/document-participants/hook/useParticipants.ts';
import type { ParticipantResponseDto } from '@/shared/api/model';

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

const ParticipantsSection = ({
  online,
  participants,
  currentUserId,
}: {
  online: boolean;
  participants: ParticipantResponseDto[];
  currentUserId: string;
}) => {
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
          />
        ))}
      </div>
    </section>
  );
};

export const ParticipantsPanel = ({ documentId, isOpen, toggleOpen }: ParticipantsPanelProps) => {
  const { onlineParticipants, offlineParticipants, isPending } = useParticipants(documentId);
  const { data: currentUser } = useCurrentUser();

  if (!isOpen) return null;

  const total = onlineParticipants.length + offlineParticipants.length;

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
        {isPending || !currentUser ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : total === 0 ? (
          <p className="px-1 text-sm text-zinc-500">Пока никого нет</p>
        ) : (
          <>
            <ParticipantsSection online={true} participants={onlineParticipants} currentUserId={currentUser.id} />
            <ParticipantsSection online={false} participants={offlineParticipants} currentUserId={currentUser.id} />
          </>
        )}

        <Button className="mt-3 w-full" variant="outline">
          <Plus />
          Пригласить
        </Button>
      </div>
    </aside>
  );
};
