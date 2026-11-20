import { Editor, type EditorProps } from '@/pages/document/Editor.tsx';
import { useHocuspocusEvent } from '@hocuspocus/provider-react';
import { Spinner } from '@/shared/ui/spinner.tsx';
import { useState } from 'react';

export const EditorGate = ({ documentId, currentUser, role }: EditorProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useHocuspocusEvent('authenticated', () => {
    setIsAuthenticated(true);
  });

  if (!isAuthenticated) {
    return <Spinner className="size-10" />;
  }

  return <Editor documentId={documentId} currentUser={currentUser} role={role} />;
};
