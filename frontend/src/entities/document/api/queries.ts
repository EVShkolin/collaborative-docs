import { useQuery } from '@tanstack/react-query';
import { getDocuments } from '@/shared/api/apiClient';

const { getV1DocumentsFindAll } = getDocuments();

export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: () => getV1DocumentsFindAll(),
  });
};
