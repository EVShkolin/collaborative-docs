import { useQueryClient } from '@tanstack/react-query';
import { useRemoveParticipant } from '@/entities/participant/api/queries.ts';
import { useNavigate } from 'react-router-dom';

export const useLeaveDocument = (documentId: string) => {
  const queryClient = useQueryClient();
  const removeMutation = useRemoveParticipant(documentId);
  const navigate = useNavigate();

  const leave = (participantId: string) => {
    navigate('/documents', { replace: true });

    queryClient.removeQueries({
      queryKey: ['documents', documentId, 'access'],
    });
    queryClient.invalidateQueries({
      queryKey: ['documents'],
      exact: true,
    });

    void removeMutation
      .mutateAsync(participantId)
      .then(() => {
        queryClient.removeQueries({ queryKey: ['documents', documentId] });
        queryClient.invalidateQueries({
          queryKey: ['documents'],
          exact: true,
        });
      })
      .catch(() => {
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
