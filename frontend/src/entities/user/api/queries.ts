import  { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsers } from '@/shared/api/apiClient';
import type { PutV1UsersUpdateBody, UserResponseDto } from '@/shared/api/model';
import { toast } from '@/shared/ui/toast.tsx';

const { getV1UsersFindMe, putV1UsersUpdate } = getUsers();

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => getV1UsersFindMe(),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: PutV1UsersUpdateBody) => putV1UsersUpdate(body),

    onSuccess: (user: UserResponseDto) => {
      queryClient.setQueryData<UserResponseDto>(['user', 'me'], user);
    },

    onError: () => {
      toast.add({
        title: 'Ошибка обновления профиля',
        description: 'Не удалось сохранить изменения. Попробуйте позже',
        type: 'error',
      });
    }
  });
};
