import { DocumentsHeader } from '@/widgets/documents-header/ui/DocumentsHeader.tsx';
import { Button } from '@/shared/ui/button.tsx';
import { Grid2X2, LayoutList, Search, SlidersHorizontal } from 'lucide-react';
import { useDeferredValue, useMemo } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/toggle-group.tsx';
import { Separator } from '@/shared/ui/separator.tsx';
import { DocumentCard } from '@/entities/document/ui/DocumentCard.tsx';
import { useDocuments } from '@/entities/document/api/queries.ts';
import { DocumentCardSkeleton } from '@/entities/document/ui/DocumentCardSkeleton.tsx';
import { DocumentCreateButton } from '@/features/manage-documents';
import { useCurrentUser } from '@/entities/user/api/queries.ts';
import { useDocumentsFilter } from '@/features/documents-search/model/store.ts';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty.tsx';

export const DocumentListPage = () => {
  const { data: documents } = useDocuments();
  const { data: currentUser } = useCurrentUser();

  const search = useDocumentsFilter((s) => s.search);
  const tab = useDocumentsFilter((s) => s.tab);
  const view = useDocumentsFilter((s) => s.view);
  const setTab = useDocumentsFilter((s) => s.setTab);
  const setView = useDocumentsFilter((s) => s.setView);

  const deferredSearch = useDeferredValue(search);

  const filtered = useMemo(() => {
    if (!documents) return documents;
    if (tab !== 'all' && !currentUser) return null;

    const q = deferredSearch.trim().toLowerCase();

    return documents.filter((doc) => {
      if (tab === 'mine' && doc.owner.id !== currentUser!.id) return false;
      if (tab === 'shared' && doc.owner.id === currentUser!.id) return false;
      return !(q && !doc.title.toLowerCase().includes(q));
    });
  }, [documents, currentUser, tab, deferredSearch]);

  return (
    <>
      <DocumentsHeader />

      <main className="mx-auto max-w-7xl px-5 pb-16 pt-10 lg:px-8 lg:pt-14">
        <div className="">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Рабочее пространство
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">Документы</h1>
              <p className="mt-2 text-sm text-muted-foreground">Все идеи и решения команды — в одном месте.</p>
            </div>
            <DocumentCreateButton />
          </div>
        </div>

        <div className="mt-10 pb-3 flex flex-col gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
          <ToggleGroup
            value={[tab]}
            onValueChange={(value) => {
              if (value[0]) setTab(value[0] as typeof tab);
            }}
          >
            {(
              [
                ['all', 'Все'],
                ['mine', 'Мои'],
                ['shared', 'Доступные мне'],
              ] as const
            ).map(([value, label]) => (
              <ToggleGroupItem
                key={value}
                value={value}
                aria-label={label}
                className={`text-muted-foreground hover:bg-transparent ${tab === value ? 'text-primary' : ''}`}
              >
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <ToggleGroup
            value={[view]}
            onValueChange={(value) => {
              if (value[0]) setView(value[0] as typeof view);
            }}
          >
            <Button variant="ghost">
              <SlidersHorizontal size={16} />
            </Button>
            <Separator orientation="vertical" className="h-5 mx-1 my-auto" />
            <ToggleGroupItem value="grid">
              <Grid2X2 size={16} />
            </ToggleGroupItem>
            <ToggleGroupItem value="list">
              <LayoutList size={17} />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {!filtered ? (
          <ul className="flex flex-col rounded-xl bg-card border mt-6 overflow-hidden">
            {[1, 2, 3].map((v) => (
              <DocumentCardSkeleton key={v} />
            ))}
          </ul>
        ) : filtered.length === 0 ? (
          <EmptyList />
        ) : (
          <ul className="flex flex-col rounded-xl bg-card border mt-6 overflow-hidden">
            {filtered.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </ul>
        )}
      </main>
    </>
  );
};

const EmptyList = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Search />
        </EmptyMedia>
        <EmptyTitle>Ничего не найдено</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">Попробуйте изменить запрос или фильтр</EmptyDescription>
      </EmptyHeader>
      <EmptyContent></EmptyContent>
    </Empty>
  );
};
