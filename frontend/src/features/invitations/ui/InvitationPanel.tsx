import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu.tsx';
import { Bell, Loader2, RefreshCcwIcon } from 'lucide-react';
import { Button } from '@/shared/ui/button.tsx';
import { InvitationCard } from '@/features/invitations/ui/InvitationCard.tsx';
import type { InvitationActionRequestDto } from '@/shared/api/model';
import { useInvitations, useInvitationAction } from '@/entities/invitation/api/queries.ts';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty';

const acceptAction: InvitationActionRequestDto = { action: 'accept' } as never;
const declineAction: InvitationActionRequestDto = { action: 'decline' } as never;

export const InvitationPanel = () => {
  const { data: invitations = [], isLoading, refetch } = useInvitations();
  const { mutate, isPending, variables } = useInvitationAction();

  const handleAccept = (id: string) => mutate({ id, action: acceptAction });
  const handleDecline = (id: string) => mutate({ id, action: declineAction });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="text-muted-foreground hover:text-accent-foreground">
            <Bell />
          </Button>
        }
      />
      <DropdownMenuContent className="flex h-[32rem] w-[26rem] flex-col overflow-hidden p-0">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : invitations.length === 0 ? (
          <EmptyInvitationPanel onRefresh={refetch} />
        ) : (
          <div className="flex-1 space-y-2 overflow-y-auto p-2">
            {invitations.map((invitation) => (
              <InvitationCard
                key={invitation.id}
                invitation={invitation}
                onAccept={handleAccept}
                onDecline={handleDecline}
                isPending={isPending && variables?.id === invitation.id}
              />
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const EmptyInvitationPanel = ({ onRefresh }: { onRefresh: () => void }) => {
  return (
    <Empty className="h-full bg-muted/30">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Bell />
        </EmptyMedia>
        <EmptyTitle>Нет приглашений</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">Тут появлятся новые приглашения</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCcwIcon data-icon="inline-start" />
          Перезагрузить
        </Button>
      </EmptyContent>
    </Empty>
  );
};
