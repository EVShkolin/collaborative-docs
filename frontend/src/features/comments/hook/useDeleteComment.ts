import { useMutation, useQueryClient } from '@tanstack/react-query';
import { $removeMarkID } from '@lexical/mark';
import type { LexicalEditor } from 'lexical';
import { getComments } from '@/shared/api/apiClient';
import type { CommentResponseDto } from '@/shared/api/model';

const { deleteV1CommentsDelete } = getComments();

export const useDeleteComment = (editor: LexicalEditor, documentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteV1CommentsDelete(documentId, commentId),
    onSuccess: (_, commentId) => {
      editor.update(() => {
        $removeMarkID(commentId);
      });

      queryClient.setQueryData<CommentResponseDto[]>(['comments', documentId], (old = []) =>
        old.filter((c) => c.id !== commentId)
      );
    },
  });
};
