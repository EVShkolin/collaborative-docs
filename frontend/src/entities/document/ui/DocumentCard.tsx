import { FileText } from 'lucide-react';
import type { DocumentWithParticipantDto } from '@/shared/api/model';
import { UserAvatar } from '@/entities/user/ui/UserAvatar.tsx';
import { Link } from 'react-router';
import { DocumentCardOptions } from '@/features/manage-documents';
import { useCurrentUser } from '@/entities/user/api/queries.ts';
import { formatRelativeTime } from '@/shared/util/timeFormat.ts';

export const DocumentCard = ({ doc }: { doc: DocumentWithParticipantDto }) => {
  const { data: currentUser } = useCurrentUser();

  return (
    <li className="grid grid-cols-[5%_50%_18%_20%_7%] items-center gap-2 w-full p-4 border-b last:border-b-0 border-accent hover:bg-background cursor-pointer">
      <Link to={`/documents/${doc.id}`} className="contents">
        <div className=" flex items-center justify-center rounded-lg size-9 bg-sky-100 text-sky-700">
          <FileText size={18} />
        </div>

        <h2 className="min-w-0 truncate font-medium">{doc.title}</h2>

        <div className="pl-5 flex min-w-0 items-center gap-2">
          <UserAvatar avatarUrl={doc.owner.avatarUrl} name={doc.owner.name} size="sm" />
          <span className="min-w-0 truncate text-sm text-muted-foreground">{doc.owner.name}</span>
        </div>

        <span className="min-w-0 truncate text-sm text-muted-foreground">Открыт: {formatRelativeTime(doc.lastAccessedAt)}</span>
      </Link>

      <DocumentCardOptions
        documentId={doc.id}
        participantId={doc.participantId}
        title={doc.title}
        isOwner={currentUser?.id === doc.owner.id}
      />
    </li>
  );
};
