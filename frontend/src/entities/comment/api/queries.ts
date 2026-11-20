import { getComments } from '@/shared/api/apiClient';
import { useQuery } from '@tanstack/react-query';

const { getV1CommentsFindAllByDocument } = getComments();

export const useComments = (documentId: string) => {
  return useQuery({
    queryKey: ['comments', documentId],
    queryFn: () => getV1CommentsFindAllByDocument(documentId),
  });
};
