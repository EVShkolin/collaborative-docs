import { FileText, MoreHorizontal, PencilLine, SquareArrowOutUpRight, Trash } from 'lucide-react';
import type { DocumentResponseDto } from '@/shared/api/model';
import { UserAvatar } from '@/entities/user/ui/UserAvatar.tsx';
import { Link } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu.tsx';
import { Button } from '@/shared/ui/button.tsx';

export const DocumentCard = ({ doc }: { doc: DocumentResponseDto }) => {
  return (
    <li className="grid grid-cols-[5%_55%_18%_15%_7%] items-center gap-2 w-full p-4 border-b last:border-b-0 border-accent hover:bg-background cursor-pointer">
      <Link to={`/documents/${doc.id}`} className="contents">
        <div className=" flex items-center justify-center rounded-lg size-9 bg-sky-100 text-sky-700">
          <FileText size={18} />
        </div>

        <h2 className="min-w-0 truncate font-medium">{doc.title}</h2>

        <div className="pl-5 flex min-w-0 items-center gap-2">
          <UserAvatar avatarUrl={doc.owner.avatarUrl} name={doc.owner.name} size="sm" />
          <span className="min-w-0 truncate text-sm text-muted-foreground">{doc.owner.name}</span>
        </div>

        <span className="min-w-0 truncate text-sm text-muted-foreground">created: {doc.createdAt}</span>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" className="w-10">
              <MoreHorizontal size={18} />
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <PencilLine /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SquareArrowOutUpRight /> Open in new tab
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <Trash /> Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
};
