import { useRef, useState } from 'react';
import { Input } from '@/shared/ui/input.tsx';
import { useUpdateDocument } from '@/entities/document/api/queries.ts';

type DocumentTitleInputProps = {
  id: string;
  initialTitle: string;
  readOnly?: boolean;
};

export const DocumentTitleInput = ({ id, initialTitle, readOnly = true }: DocumentTitleInputProps) => {
  const [title, setTitle] = useState<string>(initialTitle);
  const { mutate: updateDocument } = useUpdateDocument(id);
  const savedTitleRef = useRef<string>(initialTitle);

  const saveTitle = () => {
    const titleToSave = title.trim();
    if (!titleToSave) {
      setTitle(savedTitleRef.current);
      return;
    }

    if (titleToSave === savedTitleRef.current) return;

    updateDocument({ title: titleToSave }, { onSuccess: () => (savedTitleRef.current = titleToSave) });
  };

  return (
    <Input
      className={`max-w-100 border-none ${!readOnly && 'hover:bg-accent dark:hover:bg-accent'} bg-card shadow-none`}
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onBlur={saveTitle}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        }
        if (e.key === 'Escape') setTitle(savedTitleRef.current);
      }}
      readOnly={readOnly}
    />
  );
};
