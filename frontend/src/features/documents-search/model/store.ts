import { create } from 'zustand';

export type DocumentsTab = 'all' | 'mine' | 'shared';
export type DocumentsView = 'grid' | 'list';

type DocumentsFilterState = {
  search: string;
  tab: DocumentsTab;
  view: DocumentsView;
  setSearch: (value: string) => void;
  setTab: (value: DocumentsTab) => void;
  setView: (value: DocumentsView) => void;
};

export const useDocumentsFilter = create<DocumentsFilterState>((set) => ({
  search: '',
  tab: 'all',
  view: 'list',
  setSearch: (search) => set({ search }),
  setTab: (tab) => set({ tab }),
  setView: (view) => set({ view }),
}));
