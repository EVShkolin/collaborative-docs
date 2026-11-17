import { DocumentsSearch } from '@/features/documents-search/ui/DocumentsSearch.tsx';
import { Bell, Moon, Sun } from 'lucide-react';
import { Button } from '@/shared/ui/button.tsx';
import { UserAvatar } from '@/entities/user/ui/UserAvatar.tsx';
import { useTheme } from '@/app/providers/theme/ThemeContext.ts';
import { LogoIcon } from '@/shared/images/LogoIcon.tsx';
import { useCurrentUser } from '@/entities/user/api/queries.ts';
import { Skeleton } from '@/shared/ui/skeleton.tsx';

export const DocumentsHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const { data: currentUser } = useCurrentUser();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-header/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-5 px-5 lg:px-8">
        <button
          aria-label="Перейти к документам"
          className="group inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
        >
          <LogoIcon />
          <span className="text-[15px] font-semibold tracking-tight text-primary">CoDraft</span>
        </button>

        <DocumentsSearch />

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" onClick={toggleTheme} className="text-muted-foreground hover:text-accent-foreground">
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-accent-foreground">
            <Bell />
          </Button>

          {!currentUser ? (
            <Skeleton className="rounded-full size-10" />
          ) : (
            <UserAvatar name={currentUser.name} avatarUrl={currentUser.avatarUrl} size="lg" />
          )}
        </div>
      </div>
    </header>
  );
};
