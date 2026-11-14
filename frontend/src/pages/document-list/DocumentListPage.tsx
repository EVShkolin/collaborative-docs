import { DocumentsHeader } from '@/widgets/documents-header/ui/DocumentsHeader.tsx';
import { Button } from '@/shared/ui/button.tsx';
import { Grid2X2, LayoutList, Plus, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/toggle-group.tsx';
import { Separator } from '@/shared/ui/separator.tsx';
import { DocumentCard } from '@/entities/document/ui/DocumentCard.tsx';
import { useDocuments } from '@/entities/document/api/queries.ts';
import { DocumentCardSkeleton } from '@/entities/document/ui/DocumentCardSkeleton.tsx';

export const DocumentListPage = () => {
  const [tab, setTab] = useState<'all' | 'mine' | 'shared'>('all');
  const [view, setView] = useState<'grid' | 'list'>('list');
  const { data: documents } = useDocuments();

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
            <Button size="lg">
              <Plus size={16} strokeWidth={2.5} />
              Создать документ
            </Button>
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

        <ul className="flex flex-col rounded-xl bg-card border mt-6 overflow-hidden">
          {!documents
            ? [1, 2, 3].map(() => <DocumentCardSkeleton />)
            : documents.map((doc) => <DocumentCard key={doc.id} doc={doc} />)}
        </ul>
      </main>
    </>
  );
};
