import { Server } from '@hocuspocus/server';
import { getDataFromToken } from './tokenValidator';
import { databaseExtension } from './databaseExtension';

export type UserContext = {
  id: string;
  participantId: string;
  username: string;
  role: 'viewer' | 'commenter' | 'editor' | 'owner';
};

export const createHocuspocusServer = (port: number): Server => {
  return new Server<UserContext>({
    port: port,

    async onAuthenticate({ token, documentName, connectionConfig }) {
      const payload = getDataFromToken(token);
      if (payload.documentId !== documentName) {
        throw new Error(`Token doesn't belong to document ${documentName}`);
      }
      if (payload.role === 'viewer' || payload.role === 'commenter') {
        connectionConfig.readOnly = true;
      }
      console.log('New authentication from', payload.username);

      return {
        id: payload.userId,
        participantId: payload.participantId,
        username: payload.username,
        role: payload.role,
      };
    },

    async connected({ instance, documentName }) {
      const document = instance.documents.get(documentName);
      if (!document) return;

      const onlineUsers = document
        .getConnections()
        .map((conn) => conn.context as UserContext)
        .filter(Boolean)
        .map((ctx) => ({ id: ctx.id, username: ctx.username }));

      document.broadcastStateless(
        JSON.stringify({ type: 'online-participants', documentId: documentName, users: onlineUsers })
      );
    },

    async onDisconnect({ document, documentName }) {
      const connections = document.getConnections();
      const onlineUsers = connections
        .map((conn) => conn.context)
        .filter(Boolean)
        .map((ctx: UserContext) => ({ id: ctx.id, username: ctx.username }));

      document.broadcastStateless(
        JSON.stringify({ type: 'online-participants', documentId: documentName, users: onlineUsers })
      );
    },

    extensions: [databaseExtension()],
  });
};
