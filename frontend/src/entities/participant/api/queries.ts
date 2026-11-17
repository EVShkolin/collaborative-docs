import { useQuery } from '@tanstack/react-query';
import { getDocumentParticipants } from '@/shared/api/apiClient';

const { getV1ParticipantsFindAllByDocument } = getDocumentParticipants();

export const useParticipantsList = (documentId: string) => {
  return useQuery({
    queryKey: ['participants', documentId],
    queryFn: () => getV1ParticipantsFindAllByDocument(documentId),
    staleTime: 60 * 1000,
  });
};
