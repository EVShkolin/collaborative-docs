import {
  HocuspocusProviderWebsocketComponent,
  HocuspocusRoom,
} from '@hocuspocus/provider-react';
import { useCallback, type ReactNode } from 'react';
import { queryClient } from '@/shared/api/queryClient';
import { handleStatelessMessage } from '@/features/websocket/lib/handleStatelessMessage';
import { getDocuments } from '@/shared/api/apiClient';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/shared/ui/toast.tsx';

const { getV1AccessDocument } = getDocuments();

type DocumentRoomProps = {
  documentId: string;
  children: ReactNode;
};

type AccessDocumentResponse = { token: string; role: string };

export const DocumentRoom = ({ documentId, children }: DocumentRoomProps) => {
  const navigate = useNavigate();
  const getToken = useCallback(async () => {
    const cached = queryClient.getQueryData<AccessDocumentResponse>([
      'documents',
      documentId,
      'access',
    ]);
    if (cached?.token) return cached.token;

    const fresh = await queryClient.query({
      queryKey: ['documents', documentId, 'access'],
      queryFn: () => getV1AccessDocument(documentId),
    });
    return fresh.token;
  }, [documentId]);

  return (
    <HocuspocusProviderWebsocketComponent url="/ws">
      <HocuspocusRoom
        flushDelay={500}
        name={documentId}
        token={getToken}
        onStateless={(data) =>
          handleStatelessMessage(data, {
            onParticipantDeleted: () => {
              navigate('/documents', { replace: true });
              toast.add({
                title: 'Доступ к документу отозван',
                description: 'Вас удалили из участников документа',
                type: 'warning',
              });
            },
          })
        }

      >
        {children}
      </HocuspocusRoom>
    </HocuspocusProviderWebsocketComponent>
  );
};