import type { Provider } from '@lexical/yjs';

import { HocuspocusProvider } from '@hocuspocus/provider';
import { Doc } from 'yjs';

export const WEBSOCKET_ENDPOINT = 'ws://localhost:1234';

export function createWebsocketProvider(
  id: string,
  yjsDocMap: Map<string, Doc>,
): Provider {
  let doc = yjsDocMap.get(id);

  if (doc === undefined) {
    doc = new Doc();
    yjsDocMap.set(id, doc);
  }

  return createWebsocketProviderWithDoc(id, doc);
}

export function createWebsocketProviderWithDoc(id: string, doc: Doc): Provider {
  return new HocuspocusProvider({
    url: WEBSOCKET_ENDPOINT,
    name: id,
    document: doc
  }) as unknown as Provider;
}