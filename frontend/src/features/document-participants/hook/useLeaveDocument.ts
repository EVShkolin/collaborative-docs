import { useQueryClient } from '@tanstack/react-query';
import { useRemoveParticipant } from '@/entities/participant/api/queries.ts';
import type { DocumentWithParticipantDto } from '@/shared/api/model';

export const useLeaveDocument = (documentId: string) => {
  const queryClient = useQueryClient();
  const removeMutation = useRemoveParticipant(documentId);

  const leave = (participantId: string) => {
    queryClient.removeQueries({
      queryKey: ['documents', documentId, 'access'],
    });

    void removeMutation
      .mutateAsync(participantId)
      .then(() => {
        queryClient.removeQueries({ queryKey: ['documents', documentId] });
      })
      .finally(() => {
        queryClient.setQueryData<DocumentWithParticipantDto[]>(['documents'], (prev) =>
          prev?.filter((doc) => doc.id !== documentId)
        );
        queryClient.invalidateQueries({
          queryKey: ['documents'],
          exact: true,
        });
      });
  };

  return {
    ...removeMutation,
    mutate: leave,
  };
};
