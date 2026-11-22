import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import type { InvitationResponseDto } from '@/shared/api/model';
import { Check, Clock, FileText, Loader2, X } from 'lucide-react';
import type { ParticipantRole } from '@/shared/api/model';
import { UserAvatar } from '@/entities/user/ui/UserAvatar.tsx';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button.tsx';
import { formatRelativeTime } from '@/shared/util/timeFormat.ts';

const ROLE_LABELS: Record<ParticipantRole, string> = {
  owner: 'Владелец',
  editor: 'Редактор',
  commenter: 'Комментатор',
  viewer: 'Читатель',
};

interface InvitationCardProps {
  invitation: InvitationResponseDto;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  isPending?: boolean;
}

export const InvitationCard = ({ invitation, onAccept, onDecline, isPending = false }: InvitationCardProps) => {
  const { id, invitedBy, document, role, invitedAt } = invitation;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0">
        <UserAvatar avatarUrl={invitedBy.avatarUrl} name={invitedBy.name} />

        <div className="min-w-0 flex-1">
          <p className="text-sm leading-snug">{invitedBy.name}</p>
          <p className="truncate text-xs text-muted-foreground">{invitedBy.email}</p>
        </div>

        <span className="flex shrink-0 items-center gap-1 text-xs text-text">
          <Clock className="h-3 w-3" />
          {formatRelativeTime(invitedAt)}
        </span>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-background">
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{document.title}</p>
          </div>

          <Badge variant="secondary" className="shrink-0">
            {ROLE_LABELS[role] ?? role}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button className="flex-1" onClick={() => onAccept?.(id)} disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Принять
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => onDecline?.(id)} disabled={isPending}>
          <X className="h-4 w-4" />
          Отклонить
        </Button>
      </CardFooter>
    </Card>
  );
};
