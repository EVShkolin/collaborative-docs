import { HocuspocusProviderWebsocketComponent, HocuspocusRoom } from '@hocuspocus/provider-react';
import { HocuspocusProviderWebsocket } from '@hocuspocus/provider';
import { useMemo } from 'react';
import { Editor } from '@/Editor.tsx';

const App = () => {
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
  )

  return (
    <HocuspocusProviderWebsocketComponent websocketProvider={websocketProvider}>
      <HocuspocusRoom name='test'>
        <Editor />
      </HocuspocusRoom>
    </HocuspocusProviderWebsocketComponent>
  )
};

export default App;
