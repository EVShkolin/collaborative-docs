import { InputGroup, InputGroupAddon, InputGroupInput } from '@/shared/ui/input-group.tsx';
import { Search } from 'lucide-react';
import { useDocumentsFilter } from '../model/store.ts';

export const DocumentsSearch = () => {
  const search = useDocumentsFilter((s) => s.search);
  const setSearch = useDocumentsFilter((s) => s.setSearch);

  return (
    <InputGroup className="max-w-lg min-w-30 mx-auto bg-muted">
      <InputGroupInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск по документам..."
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
};
