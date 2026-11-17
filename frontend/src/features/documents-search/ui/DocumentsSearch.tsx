import { InputGroup, InputGroupAddon, InputGroupInput } from '@/shared/ui/input-group.tsx';
import { Search } from 'lucide-react';

export const DocumentsSearch = () => {
  return (
    <InputGroup className="max-w-lg min-w-30 mx-auto bg-muted">
      <InputGroupInput placeholder="Поиск по документам..." />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
};
