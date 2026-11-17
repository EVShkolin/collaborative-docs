import { HocuspocusProviderWebsocket } from '@hocuspocus/provider';
import { toast } from '@/shared/ui/toast.tsx';

export const createWebsocketProvider = () => {
  return new HocuspocusProviderWebsocket({
    url: '/ws',
    maxAttempts: 5,
    onMaxAttemptsFailed: ({ error }) => {
      toast.add({
        title: 'Ошибка подключения к серверу',
        description: 'Не получилось создать websocket-подключение',
        type: 'error',
      });
      console.error('Could not connect to the server:', error);
    },
  });
};
