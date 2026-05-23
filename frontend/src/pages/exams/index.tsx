import { isBefore } from "date-fns";
import {
  Calendar,
  CheckCircle2,
  Clock,
  ListCheck,
  Radio,
  XCircle,
} from "lucide-react";
import ExamTypeBadge from "./components/exam-type-badge";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/helpers";
import { useClassroomIdLoaderData } from "@/features/classrooms/hooks/use-classrooms-loader-data";
import { useQuery } from "@tanstack/react-query";
import { getExamsQueryOptions } from "@/features/exams/query";
import type { ExampulseError } from "@/types/common";
import ExamSkeleton from "./components/skeleton";
import ExamEmpty from "./components/exam-empty";
import ExamDropdownMenu from "./components/exam-dropdown";

export default function Exams() {
  const classroomId = useClassroomIdLoaderData();
  const { data, isPending, isError, error } = useQuery(
    getExamsQueryOptions(classroomId),
  );

  const exampulseError = error as ExampulseError;
  const exams = data?.data || [];

  if (isPending) {
    return <ExamSkeleton />;
  } else if (isError) {
    return (
      <div>
        {exampulseError?.response?.data.message || "Something went wrong"}
      </div>
    );
  } else if (exams.length === 0) {
    return <ExamEmpty classroomId={classroomId} />;
  }

  return (
    <div className="space-y-3">
      {exams.map((exam) => {
        const deadlinePassed =
          exam.deadline && isBefore(new Date(exam.deadline), exam.scheduled_at);

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
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ListCheck className="size-3" />
                    {exam.questions_count} questions
                  </span>
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
              <ExamDropdownMenu exam={exam} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
