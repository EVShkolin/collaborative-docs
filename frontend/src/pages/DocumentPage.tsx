import { HocuspocusProviderWebsocketComponent, HocuspocusRoom } from '@hocuspocus/provider-react';
import { HocuspocusProviderWebsocket } from '@hocuspocus/provider';
import { useMemo } from 'react';
import { Editor } from '@/Editor.tsx';
import { useParams } from 'react-router-dom';
import { getCollaborativeDocsAPI } from '@/api/apiClient';

const { getV1DocumentsGetWsToken } = getCollaborativeDocsAPI();

export const DocumentPage = () => {
  const { documentId } = useParams();

  const websocketProvider = useMemo(
    () =>
      new HocuspocusProviderWebsocket({
        url: '/ws',
        maxAttempts: 5,
        onMaxAttemptsFailed: ({ error }) => {
          console.error('Could not connect to the server:', error)
        },
      }),
    [],
  );

  if (!websocketProvider || typeof documentId !== 'string') {
    return <div className="flex justify-center p-10">Подключение к документу...</div>;
  }

  return (
    <HocuspocusProviderWebsocketComponent websocketProvider={websocketProvider}>
      <HocuspocusRoom
        name={documentId}
        token={async () => {
          try {
            const res = await getV1DocumentsGetWsToken(documentId);
            return res.token;
          } catch (err) {
            console.log('Could not get ws token: ' + err);
            throw err;
          }
        }}
      >
        <Editor />
      </HocuspocusRoom>
    </HocuspocusProviderWebsocketComponent>
  );
};