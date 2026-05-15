import { Button } from "@/components/ui/button";
import ExamForm, { type ExamFormIntent } from "../components/forms/exam-form";
import { Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useCreateExam } from "@/features/exams/hooks/use-exam";
import type { ExamSchema } from "@/features/exams/type";

export default function ExamCreate() {
  const [createExam, isCreating] = useCreateExam();
  const navigate = useNavigate();
  const handleCreateExam = (payload: ExamSchema, intent: ExamFormIntent) => {
    console.log(intent)
    if (intent === "save-only") {
      createExam(payload, {
        onSuccess: (exam) => {
          navigate(`/exams/${exam.id}`);
        },
      });
    }
  };
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8">
      {/* ── Header ── */}
      <div className="space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 text-muted-foreground"
          asChild
        >
          <Link to={"/exams"}>
            <ArrowLeft data-icon="inline-start" />
            Back to Exams
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
