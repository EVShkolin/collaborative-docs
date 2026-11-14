import { Editor } from '@/pages/document/Editor.tsx';
import { useHocuspocusEvent } from '@hocuspocus/provider-react';
import { Spinner } from '@/shared/ui/spinner.tsx';
import { useState } from 'react';

export const EditorGate = ({ documentId }: { documentId: string }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useHocuspocusEvent('authenticated', () => {
    setIsAuthenticated(true);
  });

  if (!isAuthenticated) {
    return <Spinner className="size-10" />;
  }

  return <Editor documentId={documentId} />;
};
