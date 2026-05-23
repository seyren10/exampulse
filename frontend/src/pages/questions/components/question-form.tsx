import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { FileText, ImageIcon, Star, ListChecks, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import AppFileUpload from "@/components/app/app-file-upload";
import { questionSchema } from "@/features/questions/schema";
import type { QuestionSchema } from "@/features/questions/type";
import { DevTool } from "@hookform/devtools";
import OptionRows from "./option-rows";

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

// ─── Main Component ───────────────────────────────────────────────────────────

type QuestionFormProps = {
  question?: Partial<QuestionSchema & { id: number; image_url?: string }>;
  onSubmit?: (payload: QuestionSchema) => void;
  loading?: boolean;
};

export default function QuestionForm({
  question,
  onSubmit,
  loading,
}: QuestionFormProps) {
  const formMethods = useForm<QuestionSchema>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question_text: question?.question_text ?? "",
      image: null,
      points: question?.points ?? undefined,
      order: question?.order ?? undefined,
      options: question?.options ?? [
        { option_text: "", is_correct: false, order: 0 },
        { option_text: "", is_correct: false, order: 0 },
      ],
    },
  });

  const { control, handleSubmit } = formMethods;

  async function submit(values: QuestionSchema) {
    await onSubmit?.(values);
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(submit)}
        encType="multipart/form-data"
        className="flex flex-col gap-6"
      >
        {/* ─ Section: Question ─ */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <SectionHeading icon={FileText} label="Question" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <FieldGroup>
              {/* Question text */}
              <Controller
                control={control}
                name="question_text"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Question text</FieldLabel>
                    <Textarea
                      id={field.name}
                      placeholder="e.g. What is the derivative of x²?"
                      className="resize-none"
                      rows={3}
                      autoFocus
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Points */}
              <Controller
                control={control}
                name="points"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Points{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FieldLabel>
                    <div className="relative">
                      <Star className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id={field.name}
                        type="number"
                        min={1}
                        placeholder="1"
                        className="pl-9"
                        aria-invalid={fieldState.invalid}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        pts
                      </span>
                    </div>
                    <FieldDescription>
                      Leave blank to use the exam default.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        {/* ─ Section: Image ─ */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <SectionHeading icon={ImageIcon} label="Image" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              control={control}
              name="image"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <AppFileUpload
                    value={field.value ?? question?.image_url ?? null}
                    onChange={field.onChange}
                    accept="image/*"
                    maxSizeMb={2}
                    disabled={loading}
                  />
                  <FieldDescription>
                    Optional image shown alongside the question. Max 2MB.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </CardContent>
        </Card>

        {/* ─ Section: Options ─ */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <SectionHeading icon={ListChecks} label="Answer options" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Options list */}
            <OptionRows />
          </CardContent>
        </Card>

        {/* ─ Actions ─ */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild disabled={loading}>
            <Link to="../" relative="path">
              Cancel
            </Link>
          </Button>

          <Button type="submit" disabled={loading}>
            <Save data-icon="inline-start" />
            {loading ? "Saving…" : "Save question"}
          </Button>
        </div>
        <DevTool control={control} />
      </form>
    </FormProvider>
  );
}
