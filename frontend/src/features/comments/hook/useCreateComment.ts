import { useMutation, useQueryClient } from '@tanstack/react-query';
import { $addMarkID } from '@lexical/mark';
import { $createRangeSelection, type LexicalEditor } from 'lexical';
import { getComments } from '@/shared/api/apiClient';
import type { CommentResponseDto } from '@/shared/api/model';

const { postV1CommentsSave } = getComments();

export type SavedSelection = {
  anchor: { key: string; offset: number; type: 'text' | 'element' };
  focus: { key: string; offset: number; type: 'text' | 'element' };
};

export const useCreateComment = (editor: LexicalEditor, documentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, selection }: { content: string; selection: SavedSelection }) => {
      const comment = await postV1CommentsSave(documentId, { content });
      return { comment, selection };
    },

    onSuccess: ({ comment, selection }) => {
      editor.update(
        () => {
          const range = $createRangeSelection();
          range.anchor.set(selection.anchor.key, selection.anchor.offset, selection.anchor.type);
          range.focus.set(selection.focus.key, selection.focus.offset, selection.focus.type);
          $addMarkID(comment.id, range);
        },
        { discrete: true }
      );

      queryClient.setQueryData<CommentResponseDto[]>(['comments', documentId], (old = []) => [...old, comment]);
    },
  });
};
