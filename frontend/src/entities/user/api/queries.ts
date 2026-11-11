import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/shared/api/apiClient';

const { getV1UsersFindMe } = getUsers();

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => getV1UsersFindMe(),
  });
};
