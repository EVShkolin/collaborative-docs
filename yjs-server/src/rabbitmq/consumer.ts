import { AsyncMessage, Connection } from 'rabbitmq-client';
import { Server } from '@hocuspocus/server';
import {
  CommentCreatedEvent,
  CommentDeletedEvent,
  ParticipantAddedEvent,
  ParticipantDeletedEvent,
  RoleChangedEvent,
} from './messages';
import { UserContext } from '../server';

export const createRabbitmqConnection = (url: string): Connection => {
  const rabbit = new Connection(url);
  rabbit.on('error', (err) => console.log('RabbitMQ connection error', err));
  rabbit.on('connection', () => console.log('Connection successfully (re)established'));

  return rabbit;
};

export const registerConsumers = (rabbit: Connection, server: Server) => {
  const participantsConsumer = rabbit.createConsumer(
    {
      queue: 'participant_queue',
      queueOptions: { durable: true },
      qos: { prefetchCount: 1 },
      exchanges: [{ exchange: 'app_events', type: 'topic', durable: true }],
      queueBindings: [{ exchange: 'app_events', routingKey: 'participant.#' }],
    },
    async (msg) => {
      switch (msg.routingKey) {
        case 'participant.role.changed':
          handleParticipantsRoleChanged(msg, server);
          break;
        case 'participant.added':
          handleParticipantAdded(msg, server);
          break;
        case 'participant.deleted':
          handleParticipantDeleted(msg, server);
          break;
      }
    }
  );

  participantsConsumer.on('error', (err) => {
    console.log('consumer error (participant events)', err);
  });

  const commentConsumer = rabbit.createConsumer(
    {
      queue: 'comment_queue',
      queueOptions: { durable: true },
      qos: { prefetchCount: 1 },
      exchanges: [{ exchange: 'app_events', type: 'topic', durable: true }],
      queueBindings: [{ exchange: 'app_events', routingKey: 'comment.#' }],
    },
    async (msg) => {
      switch (msg.routingKey) {
        case 'comment.created':
          handleCommentCreated(msg, server);
          break;
        case 'comment.deleted':
          handleCommentDeleted(msg, server);
          break;
      }
    }
  );

  commentConsumer.on('error', (err) => {
    console.log('consumer error (comment events)', err);
  });
};

const handleParticipantsRoleChanged = (msg: AsyncMessage, server: Server) => {
  const event = msg.body as RoleChangedEvent;
  const document = server.hocuspocus.documents.get(event.documentId);
  if (!document) return;

  const connection = document
    .getConnections()
    .find((conn) => (conn.context as UserContext)?.participantId === event.participantId);
  if (connection) {
    connection.readOnly = event.role !== 'editor';
  }

  document.broadcastStateless(
    JSON.stringify({
      type: 'role-changed',
      documentId: event.documentId,
      participantId: event.participantId,
      role: event.role,
    })
  );
};

const handleParticipantAdded = (msg: AsyncMessage, server: Server) => {
  const event = msg.body as ParticipantAddedEvent;
  const document = server.hocuspocus.documents.get(event.documentId);
  if (!document) return;

  document.broadcastStateless(
    JSON.stringify({
      type: 'participant-added',
      documentId: event.documentId,
      participant: event.participant,
    })
  );
};

const handleParticipantDeleted = (msg: AsyncMessage, server: Server) => {
  const event = msg.body as ParticipantDeletedEvent;
  const document = server.hocuspocus.documents.get(event.documentId);
  if (!document) return;

  document.broadcastStateless(
    JSON.stringify({
      type: 'participant-deleted',
      documentId: event.documentId,
      participantId: event.participantId,
    })
  );

  document
    .getConnections()
    .find((conn) => (conn.context as UserContext)?.participantId === event.participantId)
    ?.close();
};

const handleCommentCreated = (msg: AsyncMessage, server: Server) => {
  const event = msg.body as CommentCreatedEvent;
  const document = server.hocuspocus.documents.get(event.documentId);
  if (!document) return;

  document.broadcastStateless(
    JSON.stringify({
      type: 'message-created',
      documentId: event.documentId,
      commentId: event.commentId,
    })
  );
};

const handleCommentDeleted = (msg: AsyncMessage, server: Server) => {
  const event = msg.body as CommentDeletedEvent;
  const document = server.hocuspocus.documents.get(event.documentId);
  if (!document) return;

  document.broadcastStateless(
    JSON.stringify({
      type: 'message-deleted',
      documentId: event.documentId,
      commentId: event.commentId,
    })
  );
};
