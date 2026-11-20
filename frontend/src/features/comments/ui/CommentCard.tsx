import { useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/shared/ui/card.tsx';
import { Button } from '@/shared/ui/button.tsx';
import { Trash2 } from 'lucide-react';
import { UserAvatar } from '@/entities/user/ui/UserAvatar.tsx';
import type { CommentResponseDto, UserResponseDto } from '@/shared/api/model';
import { getCommentPermissions } from '@/features/comments/hook/useCommentPermissions';

const formatDate = (iso: string): string => {
  return new Date(iso).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

type CommentCardProps = {
  comment: CommentResponseDto;
  currentUser: UserResponseDto | null | undefined;
  documentOwnerId: string | null | undefined;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
};

export const CommentCard = ({
  comment,
  currentUser,
  documentOwnerId,
  onSelect,
  onDelete,
  isDeleting = false,
}: CommentCardProps) => {
  const { canDelete } = useMemo(
    () => getCommentPermissions({ comment, currentUser, documentOwnerId }),
    [comment, currentUser, documentOwnerId]
  );

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(comment.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(comment.id);
        }
      }}
      className="group cursor-pointer gap-2 rounded-lg p-3 transition-colors hover:bg-accent"
    >
      <CardHeader className="flex items-center justify-between p-0">
        <div className="flex min-w-0 items-center gap-2">
          <UserAvatar name={comment.creator.name} avatarUrl={comment.creator.avatarUrl} size="sm" />
          <span className="truncate text-sm font-medium">{comment.creator.name}</span>
        </div>
        <span className="shrink-0 text-xs text-zinc-500">{formatDate(comment.createdAt)}</span>
      </CardHeader>

      <CardContent className="p-0">
        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
      </CardContent>

      {canDelete && (
        <div className="flex justify-end opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-zinc-500 hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(comment.id);
            }}
            disabled={isDeleting}
            aria-label="Удалить комментарий"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      )}
    </Card>
  );
};
