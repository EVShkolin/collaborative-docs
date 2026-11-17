import { skipToken, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDocuments } from '@/shared/api/apiClient';
import type { DocumentResponseDto } from '@/shared/api/model';
import { toast } from '@/shared/ui/toast.tsx';

const { getV1DocumentsFindAll, getV1DocumentsFindById, putV1DocumentsUpdate, getV1AccessDocument } = getDocuments();

export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: () => getV1DocumentsFindAll(),
  });
};

export const useDocument = (documentId: string) => {
  return useQuery({
    queryKey: ['documents', documentId],
    queryFn: () => getV1DocumentsFindById(documentId),
  });
};

export const useAccessDocument = (documentId: string | undefined) => {
  return useQuery({
    queryKey: ['documents', documentId, 'access'],
    queryFn: documentId ? () => getV1AccessDocument(documentId) : skipToken,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateDocument = (documentId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['documents', documentId];

  return useMutation({
    mutationFn: ({ title }: { title: string }) => putV1DocumentsUpdate(documentId, { title }),

    onMutate: async ({ title }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<DocumentResponseDto>(queryKey);
      if (previous) {
        queryClient.setQueryData<DocumentResponseDto>(queryKey, {
          ...previous,
          title,
        });
      }
      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData<DocumentResponseDto>(queryKey, context.previous);
      }
      toast.add({
        title: 'Ошибка обновление названия документа',
        description: 'Не получилось обновить название документа',
        type: 'error',
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
