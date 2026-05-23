import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Star,
  Check,
  Circle,
  Zap,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import QuestionForm from "../components/question-form";
import { useCreateQuestion } from "@/features/questions/hooks/use-question";
import type { Question, QuestionSchema } from "@/features/questions/type";
import { useInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getExamDetailQueryOptions } from "@/features/exams/query";
import { getExamDetailQueryLoader } from "@/features/exams/loader";
import { getQuestionsInfiniteQueryOptions } from "@/features/questions/query";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// ─── Question Preview Card ────────────────────────────────────────────────────

type QuestionPreviewCardProps = {
  question: Question;
  index: number;
};
function QuestionPreviewCard({ index, question }: QuestionPreviewCardProps) {
  return (
    <Card className="flex-1 basis-100">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-2">
          <Badge variant="secondary" className="mt-0.5 shrink-0">
            Q {index + 1}
          </Badge>
          <div className="space-y-2">
            <p className="text-sm font-medium leading-snug whitespace-pre-wrap">
              {question.question_text}
            </p>
            {question.points && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Star className="size-3 stroke-amber-400" />
                {question.points} pts
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      {question.image_path && (
        <AspectRatio ratio={16 / 9} className="bg-muted overflow-hidden">
          <img
            src={question.image_path}
            alt="Question"
            className="object-cover w-full"
          />
        </AspectRatio>
      )}
      <CardContent className="space-y-1.5 pt-0">
        {question.options.map((opt, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
              opt.is_correct
                ? "bg-primary/10 text-primary"
                : "bg-muted/40 text-muted-foreground",
            )}
          >
            {opt.is_correct ? (
              <CheckCircle2 className="size-3.5 shrink-0" />
            ) : (
              <Circle className="size-3.5 shrink-0" />
            )}
            {opt.option_text || (
              <span className="italic opacity-50">Empty</span>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── Aside Question Item ──────────────────────────────────────────────────────

function AsideQuestionItem({
  question,
  index,
  isActive,
  // onEdit,
  // onDelete,
}: {
  question: Question;
  index: number;
  isActive: boolean;
  // onEdit: () => void;
  // onDelete: () => void;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-lg px-2 py-2 cursor-pointer transition-colors max-w-48",
        isActive
          ? "bg-primary/10 text-primary"
          : "hover:bg-muted/60 text-foreground",
      )}
      // onClick={onEdit}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
          isActive
            ? "border-primary text-primary"
            : "border-muted-foreground/30 text-muted-foreground",
        )}
      >
        {index + 1}
      </div>

      {/* Title */}
      <span className="flex-1 truncate text-xs leading-snug">
        {question.question_text || "Untitled"}
      </span>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={(e) => {
                e.stopPropagation();
                // onEdit();
              }}
            >
              <Pencil className="size-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Edit</TooltipContent>
        </Tooltip> */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-6 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                // onDelete();
              }}
            >
              <Trash2 className="size-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Delete</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ExamCreate() {
  const examId =
    useLoaderData<Awaited<ReturnType<typeof getExamDetailQueryLoader>>>();

  const { data: examDetails } = useSuspenseQuery(
    getExamDetailQueryOptions(examId),
  );

  const { data: questionsData, isPending: isQuestionPending } =
    useInfiniteQuery(getQuestionsInfiniteQueryOptions(examId));
  const questions = questionsData?.pages.flatMap((page) => page.data) ?? [];
  const questionsCount = questionsData?.pages[0].meta.total ?? 0;

  const [isFinished, setIsFinished] = useState(false);

  const [createQuestionMutate, isCreatingQuestion] = useCreateQuestion();

  const handleSubmit = (payload: QuestionSchema) => {
    createQuestionMutate({
      examId,
      payload,
    });
  };

  // ── Finish screen ──────────────────────────────────────────────────────────

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10">
          <ClipboardList className="size-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Exam ready!</h2>
          <p className="text-muted-foreground text-sm">
            You've added 3 question(s) to this exam.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsFinished(false)}>
            Add more questions
          </Button>
          <Button asChild>
            <Link to={`/exams/${examId}`}>
              <Zap data-icon="inline-start" />
              View exam
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // ── Main layout ────────────────────────────────────────────────────────────

  return (
    <TooltipProvider>
      <div className="grid grid-rows-[auto_1fr] grid-cols-[auto_1fr]">
        {/* ── Top bar ── */}
        <div className="col-span-full flex items-center justify-between border-b px-2 h-12 sticky top-0 bg-background z-10">
          <div className="flex items-center gap-3">
            <Zap className="size-4 text-primary" />
            <span className="text-sm font-semibold">
              Exampulse Question Builder
            </span>
            {questionsCount > 0 && (
              <Badge variant="secondary">
                {questionsCount} question{questionsCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/exams/${examId}`}>Exit</Link>
            </Button>
            {questionsCount > 0 && (
              <Button size="sm">
                <Check data-icon="inline-start" />
                Finish
              </Button>
            )}
          </div>
        </div>

        {/* ── Three-column layout ── */}

        {/* ── Aside: Question list ── */}
        <aside className="flex flex-col w-48 border-r h-[94.7vh] sticky top-12">
          <div className="flex shrink-0 items-center justify-between border-b px-2 h-12">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Questions
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-6"
              // onClick={() => setEditingQuestion(null)}
              title="New question"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {questions.length === 0 ? (
              <p className="px-2 py-4 text-center text-xs text-muted-foreground leading-relaxed">
                No questions yet. Fill the form to add your first one.
              </p>
            ) : (
              <div className="flex flex-col gap-0.5 p-2">
                {questions.map((q, i) => (
                  <AsideQuestionItem key={q.id} question={q} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* New question CTA when list has items */}
          {questions.length > 0 && (
            <div className="shrink-0 border-t p-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => setEditingQuestion(null)}
              >
                <Plus data-icon="inline-start" />
                New question
              </Button>
            </div>
          )}
        </aside>

        {/* ── Middle + Right: Resizable panels ── */}
        <ResizablePanelGroup
          style={{
            overflow: "unset",
          }}
        >
          {/* ── Form panel ── */}
          <ResizablePanel defaultSize="75%" minSize="35%">
            <div className="h-full overflow-y-auto min-h-0">
              <div className="mx-auto max-w-2xl px-4 py-6 flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-semibold">Question 1</h2>
                  <p className="text-xs text-muted-foreground">
                    Fill in the details below, then save to continue.
                  </p>
                </div>

                <QuestionForm
                  onSubmit={handleSubmit}
                  loading={isCreatingQuestion}
                />
              </div>
            </div>
          </ResizablePanel>

          {/* ── Resizable handle ── */}
          <ResizableHandle withHandle />

          {/* ── Preview panel ── */}
          <ResizablePanel
            defaultSize="25%"
            minSize="25%"
            className="sticky top-12 h-[94.7vh] overflow-y-hidden!"
          >
            <div className="flex flex-col h-full">
              <div className="flex shrink-0 items-center justify-between border-b px-2 h-12">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Preview
                </span>
                {questions.length > 0 && (
                  <Badge variant="outline" className="text-[10px]">
                    {questions.length} saved
                  </Badge>
                )}
              </div>

              <div className="h-full min-h-0">
                {questions.length === 0 ? (
                  <div className="grid place-content-center h-full text-muted-foreground">
                    <ClipboardList className="size-10 opacity-20 mx-auto" />
                    <p className="text-sm">Saved questions will appear here.</p>
                  </div>
                ) : (
                  <ul className="h-full flex gap-4 flex-wrap overflow-y-auto p-4">
                    {questions.map((q, i) => (
                      <QuestionPreviewCard key={q.id} question={q} index={i} />
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* ── Delete confirm ── */}
      {/* <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete question?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.question_text?.slice(0, 60)}" will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </TooltipProvider>
  );
}
