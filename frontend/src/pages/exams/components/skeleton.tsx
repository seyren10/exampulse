import { Skeleton } from "@/components/ui/skeleton";

export default function ExamSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-30 w-full" />
      ))}
    </div>
  );
}
