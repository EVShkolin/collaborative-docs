import { skipToken, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDocuments } from '@/shared/api/apiClient';
import type { DocumentRequestDto, DocumentWithParticipantDto } from '@/shared/api/model';
import { toast } from '@/shared/ui/toast.tsx';
import { queryClient } from '@/shared/api/queryClient.ts';

const {
  getV1DocumentsFindAll,
  getV1DocumentsFindById,
  putV1DocumentsUpdate,
  getV1AccessDocument,
  postV1DocumentsSave,
  deleteV1DocumentsDelete
} = getDocuments();

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

export const useCreateDocument = () => {
  return useMutation({
    mutationFn: (payload: DocumentRequestDto) => postV1DocumentsSave(payload),

    onSuccess: (document: DocumentWithParticipantDto) => {
      queryClient.setQueryData<DocumentWithParticipantDto[]>(['documents'], (prev) =>
        prev ? [...prev, document] : [document]
      );
    },
  });
};

export const useAccessDocument = (documentId: string | undefined) => {
  return useQuery({
    queryKey: ['documents', documentId, 'access'],
    queryFn: documentId ? () => getV1AccessDocument(documentId) : skipToken,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateDocument = (documentId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['documents', documentId];

  return useMutation({
    mutationFn: ({ title }: { title: string }) => putV1DocumentsUpdate(documentId, { title }),

    onSuccess: ({ title }) => {
      queryClient.setQueryData<DocumentWithParticipantDto[]>(['documents'], (prev) =>
        prev?.map((doc) => (doc.id === documentId ? { ...doc, title } : doc))
      );
      queryClient.setQueryData<DocumentWithParticipantDto>(queryKey, (prev) => (prev ? { ...prev, title } : prev));
    },

    onError: () => {
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

export const useDeleteDocument = (documentId: string) => {
  return useMutation({
    mutationFn: () => deleteV1DocumentsDelete(documentId),

    onSuccess: () => {
      queryClient.setQueryData<DocumentWithParticipantDto[]>(['documents'], (prev) =>
        prev?.filter((doc) => doc.id !== documentId)
      );
    },

    onError: () => {
      toast.add({
        title: 'Ошибка обновление удаления документа',
        description: 'Не получилось удалить документ, попробуйте позже',
        type: 'error',
      });
    }
  });
};
