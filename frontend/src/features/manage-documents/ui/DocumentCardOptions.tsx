import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu.tsx';
import { Button } from '@/shared/ui/button.tsx';
import { Loader2, LogOut, MoreHorizontal, PencilLine, SquareArrowOutUpRight, Trash } from 'lucide-react';
import { useState } from 'react';
import { DocumentRenameDialog } from '@/features/manage-documents/ui/DocumentRenameDialog.tsx';
import { useDeleteDocument } from '@/entities/document/api/queries.ts';
import { useLeaveDocument } from '@/features/document-participants';

type DocumentCardOptionsProps = {
  documentId: string;
  participantId: string;
  title: string;
  isOwner: boolean;
};

export const DocumentCardOptions = ({ documentId, participantId, title, isOwner }: DocumentCardOptionsProps) => {
  const [renameOpen, setRenameOpen] = useState(false);
  const deleteDocument = useDeleteDocument(documentId);
  const { mutate, isPending } = useLeaveDocument(documentId);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" className="w-10">
              <MoreHorizontal size={18} />
            </Button>
          }
        />

        <DropdownMenuContent className="w-40">
          <DropdownMenuGroup>
            {isOwner && (
              <DropdownMenuItem onClick={() => setRenameOpen(true)}>
                <PencilLine /> Переименовать
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              render={<a href={`/documents/${documentId}`} target="_blank" rel="noopener noreferrer" />}
            >
              <SquareArrowOutUpRight /> Открыть в новой вкладке
            </DropdownMenuItem>
            {isOwner ? (
              <DropdownMenuItem variant="destructive" onClick={() => deleteDocument.mutate()}>
                {deleteDocument.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Trash />} Удалить
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem variant="destructive" onClick={() => mutate(participantId)}>
                {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <LogOut />} Выйти из документа
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DocumentRenameDialog documentId={documentId} oldTitle={title} open={renameOpen} onOpenChange={setRenameOpen} />
    </>
  );
};
