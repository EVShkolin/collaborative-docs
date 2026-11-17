import type { onStatelessParameters } from '@hocuspocus/provider';
import { useOnlineParticipantsStore } from '@/entities/participant/model/onlineParticipantsStore.ts';

export const handleStatelessMessage = ({ payload }: onStatelessParameters) => {
  console.log(payload);
  try {
    const data = JSON.parse(payload);
    if (data.type === 'online-participants') {
      useOnlineParticipantsStore.getState().setOnlineParticipants(data.documentId, data.users);
    }
  } catch (error) {
    console.error(error);
  }
};
