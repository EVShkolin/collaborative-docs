import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDocumentParticipants } from '@/shared/api/apiClient';

const { getV1ParticipantsFindAllByDocument, deleteV1ParticipantsDelete } =
  getDocumentParticipants();

export const useParticipantsList = (documentId: string) => {
  return useQuery({
    queryKey: ['participants', documentId],
    queryFn: () => getV1ParticipantsFindAllByDocument(documentId),
  });
};

export const useRemoveParticipant = (documentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (participantId: string) => deleteV1ParticipantsDelete(documentId, participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants', documentId] });
    },
  });
};
