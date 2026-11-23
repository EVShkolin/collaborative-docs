import { useParams } from 'react-router-dom';
import { EditorGate } from '@/pages/document/EditorGate.tsx';
import { DocumentRoom } from '@/pages/document/DocumentRoom.tsx';
import { useAccessDocument } from '@/entities/document/api/queries.ts';
import { useCurrentUser } from '@/entities/user/api/queries.ts';
import { Spinner } from '@/shared/ui/spinner.tsx';

export const DocumentPage = () => {
  const { documentId } = useParams();
  const accessQuery = useAccessDocument(documentId);
  const userQuery = useCurrentUser();

  const isPending = accessQuery.isPending || userQuery.isPending;
  const isError = accessQuery.isError || userQuery.isError || !documentId;

  if (isError) {
    return <div className="p-10">Документ не найден</div>;
  }

  if (isPending) {
    return <Spinner className="size-10" />;
  }

  return (
    <DocumentRoom documentId={documentId}>
      <EditorGate documentId={documentId} currentUser={userQuery.data} role={accessQuery.data.role} />
    </DocumentRoom>
  );
};
