import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { QuestionSchema } from "@/features/questions/type";
import { cn } from "@/lib/utils";
import { CheckCircle2, GripVertical, Plus, Trash2 } from "lucide-react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";

type Props = {
  loading?: boolean;
};
export default function OptionRows({ loading }: Props) {
  const { control } = useFormContext<QuestionSchema>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const watchedOptions = useWatch({
    control,
    name: "options",
  });

  function addOption() {
    append({ option_text: "", is_correct: false, order: fields.length });
  }
  return (
    <Controller
      control={control}
      name="options"
      render={({ fieldState }) => (
        <div className="flex flex-col gap-2">
          {fields.map((option, index) => {
            // Read live value from watchedOptions, NOT fields[index]
            const isCorrect = watchedOptions[index]?.is_correct ?? false;

            return (
              <Field
                key={option.id}
                orientation="horizontal"
                data-invalid={fieldState.invalid}
                className={cn(
                  "flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 transition-colors",
                  isCorrect && "border-primary/40 bg-primary/5",
                )}
              >
                {/* Drag handle */}
                <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground/40" />

                {/* Correct checkbox */}
                <Controller
                  control={control}
                  name={`options.${index}.is_correct`}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-label="Mark as correct"
                    />
                  )}
                />

                {/*
                  Option text input wrapper:
                  flex-1  — takes remaining width in the row
                  min-w-0 — CRITICAL: allows Input to shrink below its
                            intrinsic width. Without this, the input refuses
                            to shrink and overflows the row / panel.
                */}
                <Controller
                  control={control}
                  name={`options.${index}.option_text`}
                  render={({ field, fieldState: textState }) => (
                    <Field
                      data-invalid={textState.invalid}
                      className="flex-1 min-w-0"
                    >
                      <Input
                        {...field}
                        placeholder={`Option ${index + 1}`}
                        className="w-full"
                        aria-invalid={textState.invalid}
                      />
                      {textState.invalid && (
                        <FieldError errors={[textState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Correct badge */}
                {isCorrect && (
                  <Badge
                    variant="outline"
                    className="shrink-0 gap-1 border-primary/40 text-[10px] text-primary"
                  >
                    <CheckCircle2 className="size-2.5" />
                    Correct
                  </Badge>
                )}

                {/* Remove — only shown when more than 2 options */}
                {fields.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(index)}
                    aria-label="Remove option"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </Field>
            );
          })}

          {/* Add option */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={addOption}
            disabled={loading}
          >
            <Plus data-icon="inline-start" />
            Add option
          </Button>

          <p className="text-xs text-muted-foreground">
            Check the box next to an option to mark it as the correct answer.
          </p>

          {fieldState.invalid && fieldState.error?.message && (
            <FieldError errors={[fieldState.error?.root]} />
          )}
        </div>
      )}
    />
  );
}
