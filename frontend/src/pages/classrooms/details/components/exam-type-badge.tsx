import { Badge } from "@/components/ui/badge";
import type { ExamType } from "@/features/exams/type";
import { Timer, Wifi } from "lucide-react";

type ExamTypeBadgeProps = {
  type: ExamType;
};
export default function ExamTypeBadge({ type }: ExamTypeBadgeProps) {
  return type === "live" ? (
    <Badge
      variant="destructive"
      className="gap-1 uppercase text-[10px] tracking-wider"
    >
      <Wifi className="size-2.5" />
      Live
    </Badge>
  ) : (
    <Badge
      variant="secondary"
      className="gap-1 uppercase text-[10px] tracking-wider"
    >
      <Timer className="size-2.5" />
      Async
    </Badge>
  );
}
