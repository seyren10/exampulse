import { Skeleton } from "@/components/ui/skeleton";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  listCount?: number;
};
export default function ClassroomListSkeleton({ listCount = 3 }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: listCount }).map((_, idx) => (
        <Skeleton key={idx} className="min-h-40">
          <div className="h-4 w-1/2 rounded bg-muted/50" />
          <div className="mt-2 h-4 w-1/3 rounded bg-muted/50" />
        </Skeleton>
      ))}
    </div>
  );
}
