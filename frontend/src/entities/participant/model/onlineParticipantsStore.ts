import { create } from 'zustand';

export interface OnlineParticipant {
  id: string;
  username: string;
}

interface OnlineParticipantsState {
  byDocument: Record<string, OnlineParticipant[]>;

  setOnlineParticipants: (documentId: string, participants: OnlineParticipant[]) => void;
  clearDocument: (documentId: string) => void;
}

export const useOnlineParticipantsStore = create<OnlineParticipantsState>()((set) => ({
  byDocument: {},

  setOnlineParticipants: (documentId, participants) => {
    set((state) => ({
      byDocument: { ...state.byDocument, [documentId]: participants },
    }));
  },

  clearDocument: (documentId) =>
    set((state) => {
      const { [documentId]: _, ...rest } = state.byDocument;
      return { byDocument: rest };
    }),
}));
