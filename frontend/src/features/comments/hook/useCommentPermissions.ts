import type { CommentResponseDto } from '@/shared/api/model';
import type { UserResponseDto } from '@/shared/api/model';

type PermissionsInput = {
  comment: CommentResponseDto;
  currentUser: UserResponseDto | null | undefined;
  documentOwnerId: string | null | undefined;
};

export function getCommentPermissions({ comment, currentUser, documentOwnerId }: PermissionsInput) {
  const isAuthenticated = !!currentUser;
  const isAuthor = isAuthenticated && comment.creator.id === currentUser.id;
  const isDocumentOwner = isAuthenticated && currentUser.id === documentOwnerId;

  return {
    canDelete: isAuthor || isDocumentOwner,
    canEdit: isAuthor,
  };
}
