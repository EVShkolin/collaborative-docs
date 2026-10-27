import { Server } from '@hocuspocus/server';
import { databaseExtension } from './databaseExtension';
import { getDataFromToken } from './tokenValidator';

interface UserContext {
  id: string;
  username: string;
  role: 'viewer' | 'commenter' | 'editor';
}

new Server<UserContext>({
  port: 1234,

  async onAuthenticate({ token, documentName, connectionConfig }) {
    const payload = getDataFromToken(token);
    if (payload.documentId !== documentName) {
      throw new Error(`Token doesn't belong to document ${documentName}`);
    }
    if (payload.role !== 'editor') {
      connectionConfig.readOnly = true;
    }

    return {
      id: payload.documentId,
      username: payload.username,
      role: payload.role,
    };
  },

  extensions: [
    databaseExtension(),
  ],
}).listen();
