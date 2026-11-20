import { Button } from '@/shared/ui/button';
import { MessageSquare, Send, X } from 'lucide-react';
import { Skeleton } from '@/shared/ui/skeleton.tsx';
import { useComments } from '@/entities/comment/api/queries.ts';
import { type SavedSelection, useCreateComment } from '@/features/comments/hook/useCreateComment.ts';
import { useDeleteComment } from '@/features/comments/hook/useDeleteComment.ts';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createRangeSelection, $getNodeByKey, $getSelection, $isRangeSelection, $setSelection } from 'lexical';
import { MarkStateExtension } from '@lexical/mark';
import { useState } from 'react';
import { toast } from '@/shared/ui/toast.tsx';
import { getExtensionDependencyFromEditor } from '@lexical/extension';
import { CommentCard } from '@/features/comments/ui/CommentCard.tsx';
import { useDocument } from '@/entities/document/api/queries.ts';
import { useCurrentUser } from '@/entities/user/api/queries.ts';

type CommentsPanelProps = {
  documentId: string;
  isOpen: boolean;
  toggleOpen: () => void;
};

const pluralizeComments = (count: number): string => {
  const abs = Math.abs(count);
  const lastTwo = abs % 100;
  const lastOne = abs % 10;

  if (lastTwo >= 11 && lastTwo <= 14) return 'комментариев';
  if (lastOne === 1) return 'комментарий';
  if (lastOne >= 2 && lastOne <= 4) return 'комментария';
  return 'комментариев';
};

export const CommentsPanel = ({ documentId, isOpen, toggleOpen }: CommentsPanelProps) => {
  const { data: comments, isPending } = useComments(documentId);
  const { data: document } = useDocument(documentId);
  const { data: currentUser } = useCurrentUser();
  const [editor] = useLexicalComposerContext();
  const [content, setContent] = useState('');
  const createComment = useCreateComment(editor, documentId);
  const deleteComment = useDeleteComment(editor, documentId);

  if (!isOpen) return null;

  const count = comments?.length ?? 0;

  const handleSelect = (commentId: string) => {
    editor.update(() => {
      const signal = getExtensionDependencyFromEditor(editor, MarkStateExtension).output.markIDNodeKeys;
      const nodeKeys = signal.peek().get(commentId);

      if (!nodeKeys?.length) {
        return;
      }

      const firstNode = $getNodeByKey(nodeKeys[0]);
      const lastNode = $getNodeByKey(nodeKeys[nodeKeys.length - 1]);

      if (!firstNode || !lastNode) {
        return;
      }

      const selection = $createRangeSelection();
      selection.anchor.set(firstNode.getKey(), 0, 'text');
      selection.focus.set(lastNode.getKey(), lastNode.getTextContentSize(), 'text');
      $setSelection(selection);
    });
  };

  const handleAdd = () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    let saved: SavedSelection | null = null;

    editor.getEditorState().read(() => {
      const sel = $getSelection();
      if ($isRangeSelection(sel) && !sel.isCollapsed()) {
        saved = {
          anchor: { key: sel.anchor.key, offset: sel.anchor.offset, type: sel.anchor.type },
          focus: { key: sel.focus.key, offset: sel.focus.offset, type: sel.focus.type },
        };
      }
    });

    if (!saved) {
      toast.add({
        title: 'Комментарий не добавлен',
        description: 'Выделите текст для добавления комментария',
        type: 'info',
      });
      return;
    }

    createComment.mutate({ content: trimmed, selection: saved }, { onSuccess: () => setContent('') });
  };

  return (
    <aside className="absolute inset-y-0 right-0 z-20 flex w-80 flex-col border-l bg-background shadow-xl dark:border-zinc-800">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <div>
          <h2 className="text-sm font-semibold">Комментарии</h2>
          {isPending ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            <p className="text-xs text-text">
              {count} {pluralizeComments(count)}
            </p>
          )}
        </div>
        <Button variant="ghost" onClick={toggleOpen}>
          <X />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {isPending ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : count === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <MessageSquare className="size-8 text-zinc-400" />
            <p className="text-sm text-zinc-500">Пока нет комментариев</p>
            <p className="text-xs text-zinc-400">Выделите текст и добавьте первый</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {comments!.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                documentOwnerId={document?.owner.id}
                onSelect={handleSelect}
                onDelete={(id) => deleteComment.mutate(id)}
                isDeleting={deleteComment.isPending && deleteComment.variables === comment.id}
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-t p-3">
        <textarea
          className="w-full resize-none rounded-lg border bg-transparent p-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          rows={2}
          placeholder="Напишите комментарий..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button
          className="mt-2 w-full"
          variant="outline"
          onClick={handleAdd}
          disabled={!content.trim() || createComment.isPending}
        >
          <Send />
          {createComment.isPending ? 'Отправка...' : 'Добавить'}
        </Button>
      </div>
    </aside>
  );
};
