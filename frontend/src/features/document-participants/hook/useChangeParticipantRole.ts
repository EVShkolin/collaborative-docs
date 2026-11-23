import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ParticipantResponseDto, ParticipantRole } from '@/shared/api/model';
import { getDocumentParticipants } from '@/shared/api/apiClient';

const { patchV1ParticipantsChangeRole } = getDocumentParticipants();

export const useChangeParticipantRole = (documentId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['participants', documentId];

  return useMutation({
    mutationFn: ({ participantId, role }: { participantId: string; role: ParticipantRole }) =>
      patchV1ParticipantsChangeRole(documentId, participantId, { role }),

    onMutate: async ({ participantId, role }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ParticipantResponseDto[]>(queryKey);

      queryClient.setQueryData<ParticipantResponseDto[]>(queryKey, (old) =>
        old?.map((p) => (p.user.id === participantId ? { ...p, role } : p))
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
