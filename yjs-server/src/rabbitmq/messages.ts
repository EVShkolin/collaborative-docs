export type RoleChangedEvent = {
  documentId: string;
  participantId: string;
  role: 'viewer' | 'commenter' | 'editor';
};

export type ParticipantDeletedEvent = {
  documentId: string;
  participantId: string;
};

export type CommentCreatedEvent = {
  documentId: string;
  commentId: string;
};

export type CommentDeletedEvent = {
  documentId: string;
  commentId: string;
};
