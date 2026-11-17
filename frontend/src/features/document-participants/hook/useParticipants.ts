import { useMemo } from 'react';
import { useParticipantsList } from '@/entities/participant/api/queries';
import { useOnlineParticipantsStore } from '@/entities/participant/model/onlineParticipantsStore';

export const useParticipants = (documentId: string) => {
  const { data: allParticipants, isPending, isError } = useParticipantsList(documentId);
  const onlineUsers = useOnlineParticipantsStore((s) => s.byDocument[documentId] ?? EMPTY_ARRAY);
  const onlineIds = useMemo(() => new Set(onlineUsers.map((u) => u.id)), [onlineUsers]);

  const { onlineParticipants, offlineParticipants } = useMemo(() => {
    const online = [];
    const offline = [];
    for (const p of allParticipants ?? []) {
      if (onlineIds.has(p.user.id)) online.push(p);
      else offline.push(p);
    }

    return { onlineParticipants: online, offlineParticipants: offline };
  }, [allParticipants, onlineIds]);

  return {
    allParticipants: allParticipants ?? [],
    onlineParticipants,
    offlineParticipants,
    isPending,
    isError,
  };
};

const EMPTY_ARRAY: never[] = [];
