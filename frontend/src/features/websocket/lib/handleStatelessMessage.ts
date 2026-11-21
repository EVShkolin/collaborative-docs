import type { onStatelessParameters } from '@hocuspocus/provider';
import { useOnlineParticipantsStore } from '@/entities/participant/model/onlineParticipantsStore.ts';
import { queryClient } from '@/shared/api/queryClient';
import type { DocumentAccessDto } from '@/shared/api/model';

type Callbacks = {
  onParticipantDeleted?: () => void;
};

export const handleStatelessMessage = ({ payload }: onStatelessParameters, callbacks: Callbacks = {}) => {
  try {
    const data = JSON.parse(payload);
    if (data.type === 'online-participants') {
      useOnlineParticipantsStore.getState().setOnlineParticipants(data.documentId, data.users);
    } else if (data.type === 'role-changed') {
      queryClient.invalidateQueries({ queryKey: ['participants', data.documentId] });
      queryClient.invalidateQueries({ queryKey: ['documents', data.documentId, 'access'] });
    } else if (data.type === 'message-created' || data.type === 'message-deleted') {
      queryClient.invalidateQueries({ queryKey: ['comments', data.documentId] });
    } else if (data.type === 'participant-deleted') {
      const access = queryClient.getQueryData<DocumentAccessDto>(['documents', data.documentId, 'access']);

      if (access?.participantId === data.participantId) {
        queryClient.invalidateQueries({ queryKey: ['documents'] });
        callbacks.onParticipantDeleted?.();
      } else {
        queryClient.invalidateQueries({ queryKey: ['participants', data.documentId] });
      }
    }
  } catch (error) {
    console.error(error);
  }
};
