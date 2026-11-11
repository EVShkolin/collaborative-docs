import { Skeleton } from '@/shared/ui/skeleton.tsx';

export const DocumentCardSkeleton = () => {
  return (
    <li className="grid grid-cols-[5%_55%_18%_15%_7%] items-center gap-2 w-full p-4 border-b last:border-b-0 border-accent">
      <Skeleton className="size-9 rounded-lg" />

      <Skeleton className="h-4 w-full" />

      <div className="pl-5 flex min-w-0 items-center gap-2">
        <Skeleton className="size-6 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>

      <Skeleton className="h-4 w-20" />
    </li>
  );
};
