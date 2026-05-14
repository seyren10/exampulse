import { Button } from "@/components/ui/button";
import type { Exam } from "@/features/exams/type";
import { isPast } from "date-fns";
import {
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  MoreHorizontal,
  Radio,
  XCircle,
} from "lucide-react";
import ExamTypeBadge from "./exam-type-badge";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/helpers";

type Props = {
  exams?: Exam[];
  onCreateExam: () => void;
};
export function ExamsTab({ exams = [], onCreateExam }: Props) {
  if (exams.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
        <ClipboardList className="size-10 opacity-30" />
        <p className="text-sm">No exams yet.</p>
        <Button size="sm" variant="outline" onClick={onCreateExam}>
          Create your first exam
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {exams.map((exam) => {
        const deadlinePassed = exam.deadline && isPast(new Date(exam.deadline));

        return (
          <div
            key={exam.id}
            className="group rounded-lg border bg-card p-4 transition-colors hover:bg-muted/40"
          >
            <div className="flex items-start justify-between gap-3">
              {/* Left */}
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <ExamTypeBadge type={exam.type} />
                  {exam.is_published ? (
                    <Badge variant="outline" className="gap-1 text-[10px]">
                      <CheckCircle2 className="size-2.5 text-green-500" />
                      Published
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="gap-1 text-[10px] text-muted-foreground"
                    >
                      <XCircle className="size-2.5" />
                      Draft
                    </Badge>
                  )}
                  {deadlinePassed && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] text-muted-foreground"
                    >
                      Ended
                    </Badge>
                  )}
                </div>

                <p className="font-medium leading-snug">{exam.title}</p>

                {exam.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {exam.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-0.5">
                  {exam.time_limit && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {exam.time_limit} min
                    </span>
                  )}
                  {exam.scheduled_at && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="size-3" />
                      {formatDate(exam.scheduled_at)}
                    </span>
                  )}
                  {exam.deadline && (
                    <span
                      className={`flex items-center gap-1 text-xs ${
                        deadlinePassed
                          ? "text-destructive/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Radio className="size-3" />
                      Due {formatDate(exam.deadline)}
                    </span>
                  )}
                </div>
              </div>

              {/* Right */}
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Exam actions"
              >
                <MoreHorizontal />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
