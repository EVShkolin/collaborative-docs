import { Button } from '@/shared/ui/button.tsx';
import { Check, ChevronLeft, Cloud, FileText, MessageSquare, Moon, Share2, Sun, Users } from 'lucide-react';
import { Separator } from '@/shared/ui/separator.tsx';
import { useDocument } from '@/entities/document/api/queries.ts';
import { Skeleton } from '@/shared/ui/skeleton.tsx';
import { DocumentTitleInput } from '@/features/document-title-input';
import { useTheme } from '@/app/providers/theme/ThemeContext.ts';
import { useHocuspocusSyncStatus } from '@hocuspocus/provider-react';
import { ActiveParticipantsAvatarGroup } from '@/features/document-participants';
import { Toolbar } from '@/features/editor-toolbar';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '@/entities/user/api/queries.ts';

export const EditorHeader = ({
  documentId,
  toolbarDisabled,
  onToggleParticipants,
  onToggleComments,
}: {
  documentId: string;
  toolbarDisabled: boolean;
  onToggleParticipants: () => void;
  onToggleComments: () => void;
}) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { data: doc } = useDocument(documentId);
  const { data: currentUser } = useCurrentUser();
  const syncStatus = useHocuspocusSyncStatus();

  return (
    <header className="w-full border border-border bg-header">
      <div className="flex h-14 items-center gap-2 px-3 sm:px-4">
        <Button variant="ghost" className="size-8" onClick={() => navigate('/documents')}>
          <ChevronLeft className="size-[18px]" />
        </Button>
        <Separator orientation="vertical" className="h-5 my-auto mx-1" />
        <div className="flex items-center justify-center rounded-lg mr-3 size-9 bg-sky-100 text-sky-700">
          <FileText size={18} />
        </div>
        <div className="flex-1">
          {!doc ? (
            <Skeleton className="w-40 h-4" />
          ) : (
            <DocumentTitleInput id={documentId} initialTitle={doc.title} readOnly={doc.owner.id === currentUser?.id} />
          )}
        </div>

        <div className="hidden items-center gap-1.5 text-xs text-text lg:flex">
          {syncStatus === 'synced' ? <Check size={14} /> : <Cloud className="animate-pulse" size={14} />}
          {syncStatus === 'synced' ? 'Сохранено' : 'Сохраняем...'}
        </div>
        <Separator orientation="vertical" className="h-5 my-auto mx-1" />
        <ActiveParticipantsAvatarGroup documentId={documentId} />
        <Button variant="ghost" onClick={onToggleParticipants}>
          <Users />
        </Button>
        <Button variant="ghost" onClick={onToggleComments}>
          <MessageSquare />
        </Button>
        <Button variant="ghost" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun /> : <Moon />}
        </Button>
        <Button className="hidden sm:inline-flex" variant="outline">
          <Share2 />
          Поделиться
        </Button>
      </div>

      <Toolbar disabled={toolbarDisabled} />
    </header>
  );
};
