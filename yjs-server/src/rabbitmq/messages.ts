export type RoleChangedEvent = {
  documentId: string;
  participantId: string;
  role: 'viewer' | 'commenter' | 'editor';
};

export type ParticipantAddedEvent = {
  documentId: string;
  participant: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatarUrl: string | null;
      createdAt: string;
    };
    role: 'viewer' | 'commenter' | 'editor';
    joinedAt: string;
  };
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
