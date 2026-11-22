import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { getInvitations } from '@/shared/api/apiClient';
import type { InvitationActionRequestDto, InvitationRequestDto, InvitationResponseDto } from '@/shared/api/model';
import { toast } from '@/shared/ui/toast.tsx';

const { getV1InvitationsFindAll, postV1InvitationsSave, patchV1InvitationsUpdate } = getInvitations();

export const useInvitations = () => {
  return useQuery({
    queryKey: ['invitations'],
    queryFn: () => getV1InvitationsFindAll(),
  });
};

export const useSendInvitation = () => {
  return useMutation({
    mutationFn: (payload: InvitationRequestDto) => postV1InvitationsSave(payload),
  });
};

export const useInvitationAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }: { id: string, action: InvitationActionRequestDto }) =>
      patchV1InvitationsUpdate(id, action),

    onSuccess: (_data, { id }) => {
      queryClient.setQueryData<InvitationResponseDto[]>(
        ['invitations'],
        (old) => old?.filter((inv) => inv.id !== id),
      );
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },

    onError: () => {
      toast.add({
        title: 'Ошибка обновление обработки приглашения',
        description: 'Не получилось обработать приглашение, попробуйте позже',
        type: 'error',
      });
    },
  });
};