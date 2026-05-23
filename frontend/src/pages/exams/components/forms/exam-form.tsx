import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { format } from "date-fns";
import {
  ChevronDown,
  Radio,
  Timer,
  CalendarClock,
  CalendarX2,
  Clock4,
  FileText,
  AlignLeft,
  Save,
  ListPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { examSchema } from "@/features/exams/schema";
import type { Exam, ExamSchema, ExamType } from "@/features/exams/type";
import { ButtonGroup } from "@/components/ui/button-group";
import { useEffect } from "react";

export type ExamFormIntent = "add-questions" | "save-only";

// ─── Section Heading ──────────────────────────────────────────────────────────

function SectionHeading({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
      <Icon className="size-4" />
      {label}
    </div>
  );
}

// ─── Split Submit Button ──────────────────────────────────────────────────────

function SplitSubmitButton({
  onAddQuestions,
  onSaveOnly,
  loading,
}: {
  onAddQuestions: () => void;
  onSaveOnly: () => void;
  loading?: boolean;
}) {
  return (
    <ButtonGroup>
      {/* Primary action */}
      <Button type="button" onClick={onAddQuestions} disabled={loading}>
        <ListPlus />
        Add Questions
      </Button>

      {/* Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            disabled={loading}
            aria-label="More save options"
          >
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onSelect={onSaveOnly}>
            <Save data-icon="inline-start" />
            Save without questions
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

type ExamFormProps = {
  exam?: Exam;
  onSubmit?: (values: ExamSchema, intent: ExamFormIntent) => void;
  loading?: boolean;
};
export default function ExamForm({ exam, onSubmit, loading }: ExamFormProps) {
  const { handleSubmit, control, setValue } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: exam?.title ?? "",
      description: exam?.description ?? "",
      type: exam?.type ?? "async",
      time_limit: Number(exam?.time_limit ?? ""),
      scheduled_at: exam?.scheduled_at
        ? format(new Date(exam.scheduled_at), "yyyy-MM-dd'T'HH:mm")
        : "",
      deadline: exam?.deadline
        ? format(new Date(exam.deadline), "yyyy-MM-dd'T'HH:mm")
        : "",
    },
  });

  const watchedType = useWatch({ control, name: "type" });

  function submit(intent: "add-questions" | "save-only") {
    handleSubmit((values) => onSubmit?.(values, intent))();
  }

  useEffect(() => {
    if (watchedType === "live") {
      setValue("deadline", undefined);
    }
  }, [watchedType, setValue]);

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      {/* ─ Section: Basic Info ─ */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <SectionHeading icon={FileText} label="Basic information" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <FieldGroup>
            {/* Title */}
            <Controller
              control={control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                  <Input
                    placeholder="e.g. Midterm Exam — Unit 3"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    autoFocus
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Description */}
            <Controller
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Description{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Textarea
                    placeholder="What topics does this exam cover?"
                    className="resize-none"
                    rows={3}
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      {/* ─ Section: Exam Type ─ */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <SectionHeading icon={AlignLeft} label="Exam type" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            control={control}
            name="type"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <ToggleGroup
                  type="single"
                  value={field.value}
                  onValueChange={(val) =>
                    val && field.onChange(val as ExamType)
                  }
                  className="grid grid-cols-2 "
                >
                  {/* Live */}
                  <ToggleGroupItem
                    value="live"
                    aria-label="Live quiz"
                    className="flex h-auto flex-col items-start gap-1.5 rounded-lg border px-4 py-3 text-left data-[state=on]:border-primary data-[state=on]:bg-primary/5"
                  >
                    <div className="flex items-center gap-1.5 font-medium">
                      <Radio className="size-4 text-destructive" />
                      Live quiz
                    </div>
                    <p className="text-xs font-normal text-muted-foreground leading-relaxed whitespace-break-spaces">
                      Teacher-led session. Students join via room code and
                      answer in real time.
                    </p>
                  </ToggleGroupItem>

                  {/* Async */}
                  <ToggleGroupItem
                    value="async"
                    aria-label="Async exam"
                    className="flex h-auto flex-col items-start gap-1.5 rounded-lg border px-4 py-3 text-left data-[state=on]:border-primary data-[state=on]:bg-primary/5"
                  >
                    <div className="flex items-center gap-1.5 font-medium">
                      <Timer className="size-4 text-primary" />
                      Async exam
                    </div>
                    <p className="text-xs font-normal text-muted-foreground leading-relaxed whitespace-break-spaces">
                      Students complete the exam on their own time before the
                      deadline.
                    </p>
                  </ToggleGroupItem>
                </ToggleGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </CardContent>
      </Card>

      {/* ─ Section: Schedule & Limits ─ */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <SectionHeading icon={CalendarClock} label="Schedule & limits" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <FieldGroup>
            {/* Time limit */}
            <Controller
              control={control}
              name="time_limit"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Time limit{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FieldLabel>
                  <div className="relative">
                    <Clock4 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min={1}
                      placeholder="60"
                      className="pl-9"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      min
                    </span>
                  </div>
                  <FieldDescription>
                    Leave blank for no time limit.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Scheduled at */}
            <Controller
              control={control}
              name="scheduled_at"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Scheduled date{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FieldLabel>
                  <div className="relative">
                    <CalendarClock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      type="datetime-local"
                      className="pl-9"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Deadline — async only */}
            {watchedType === "async" && (
              <Controller
                control={control}
                name="deadline"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="exam-deadline">
                      Deadline{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FieldLabel>
                    <div className="relative">
                      <CalendarX2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="exam-deadline"
                        type="datetime-local"
                        className="pl-9"
                        aria-invalid={fieldState.invalid}
                        {...field}
                      />
                    </div>
                    <FieldDescription>
                      Students cannot submit after this date. Must be after the
                      scheduled date.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
          </FieldGroup>
        </CardContent>
      </Card>

      {/* ─ Actions ─ */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild disabled={loading}>
          <Link to="../" relative="path">
            Cancel
          </Link>
        </Button>

        <SplitSubmitButton
          onAddQuestions={() => submit("add-questions")}
          onSaveOnly={() => submit("save-only")}
          loading={loading}
        />
      </div>
    </form>
  );
}
