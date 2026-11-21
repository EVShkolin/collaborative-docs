import { useCurrentUser } from '@/entities/user/api/queries.ts';
import { useDocument } from '@/entities/document/api/queries.ts';

export const useDocumentOwner = (documentId: string) => {
  const userQuery = useCurrentUser();
  const documentQuery = useDocument(documentId);

  const isPending = userQuery.isPending || documentQuery.isPending;
  const isError = userQuery.isError || documentQuery.isError;

  const isOwner =
    isPending || isError || !userQuery.data || !documentQuery.data
      ? undefined
      : documentQuery.data.owner.id === userQuery.data.id;

  return { isOwner, isPending, isError };
};