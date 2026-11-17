import { Button } from '@/shared/ui/button.tsx';
import { Check, ChevronLeft, Cloud, FileText, Moon, Share2, Sun, Users } from 'lucide-react';
import { Separator } from '@/shared/ui/separator.tsx';
import { useDocument } from '@/entities/document/api/queries.ts';
import { Skeleton } from '@/shared/ui/skeleton.tsx';
import { DocumentTitleInput } from '@/features/document-title-input/ui/DocumentTitleInput.tsx';
import { useTheme } from '@/app/providers/theme/ThemeContext.ts';
import { useHocuspocusSyncStatus } from '@hocuspocus/provider-react';
import { ActiveParticipantsAvatarGroup } from '@/features/document-participants/ui/ActiveParticipantsAvatarGroup.tsx';

export const EditorHeader = ({ documentId, toggleOpen }: { documentId: string; toggleOpen: () => void }) => {
  const { theme, toggleTheme } = useTheme();
  const { data: doc } = useDocument(documentId);
  const syncStatus = useHocuspocusSyncStatus();

  return (
    <header className="w-full border border-border bg-card">
      <div className="flex h-14 items-center gap-2 px-3 sm:px-4">
        <Button variant="ghost" className="size-8">
          <ChevronLeft className="size-[18px]" />
        </Button>
        <Separator orientation="vertical" className="h-5 my-auto mx-1" />
        <div className="flex items-center justify-center rounded-lg mr-3 size-9 bg-sky-100 text-sky-700">
          <FileText size={18} />
        </div>
        <div className="flex-1">
          {!doc ? <Skeleton className="w-40 h-4" /> : <DocumentTitleInput id={documentId} initialTitle={doc.title} />}
        </div>

        <div className="hidden items-center gap-1.5 text-xs text-chart-3 lg:flex">
          {syncStatus === 'synced' ? <Check size={14} /> : <Cloud className="animate-pulse" size={14} />}
          {syncStatus === 'synced' ? 'Сохранено' : 'Сохраняем...'}
        </div>
        <Separator orientation="vertical" className="h-5 my-auto mx-1" />
        <ActiveParticipantsAvatarGroup documentId={documentId} />
        <Button variant="ghost" onClick={toggleOpen}>
          <Users />
        </Button>
        <Button variant="ghost" onClick={toggleTheme} className="text-muted-foreground hover:text-accent-foreground">
          {theme === 'dark' ? <Sun /> : <Moon />}
        </Button>
        <Button className="hidden sm:inline-flex" variant="outline">
          <Share2 />
          Поделиться
        </Button>
      </div>

      <div className="Toolbar"></div>
    </header>
  );
};
