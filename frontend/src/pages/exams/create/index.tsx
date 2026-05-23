import { Button } from "@/components/ui/button";
import { useClassroomIdLoaderData } from "@/features/classrooms/hooks/use-classrooms-loader-data";
import { useCreateExam } from "@/features/exams/hooks/use-exam";
import type { ExamSchema } from "@/features/exams/type";
import ExamForm, {
  type ExamFormIntent,
} from "@/pages/exams/components/forms/exam-form";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";

export default function ClassroomExamCreate() {
  const classroomId = useClassroomIdLoaderData();

  const navigate = useNavigate();

  const [createExam, isCreating] = useCreateExam();
  const handleCreateExam = (payload: ExamSchema, intent: ExamFormIntent) => {
    if (intent === "save-only") {
      createExam(
        {
          classroomId,
          payload,
        },
        {
          onSuccess: () => {
            navigate(-1);
          },
        },
      );
    }
  };
  return (
    <div className="space-y-8 px-4 py-8">
      {/* ── Header ── */}
      <div className="space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 text-muted-foreground"
          disabled={isCreating}
          asChild
        >
          <Link to="../" relative="path">
            <ArrowLeft data-icon="inline-start" />
            Go back
          </Link>
        </Button>

        <div className="flex items-center gap-3 pt-1">
          <h1 className="text-2xl font-bold font-heading">Create Exam</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Set up your exam details. You can add questions after saving.
        </p>
      </div>
      <ExamForm loading={isCreating} onSubmit={handleCreateExam} />
    </div>
  );
}
