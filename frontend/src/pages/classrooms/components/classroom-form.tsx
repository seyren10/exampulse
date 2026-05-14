import { type PropsWithChildren } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { classroomSchema } from "@/features/classrooms/schema";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import type { Classroom, ClassroomSchema } from "@/features/classrooms/type";

type Props = PropsWithChildren & {
  onClose?: () => void;
  classroom?: Classroom | null;
  onSubmit: (data: ClassroomSchema) => void;
  loading?: boolean;
};


export default function ClassroomForm({
  onClose,
  classroom,
  onSubmit,
  loading,
}: Props) {
  const form = useForm({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      name: classroom?.name || "",
      description: classroom?.description || "",
    },
  });

  const isEditing = !!classroom;

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FieldGroup>
        {/* ── Name ── */}
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Classroom name</FieldLabel>
              <Input
                placeholder="e.g. Biology 101 — Section A"
                autoComplete="off"
                {...field}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        {/* ── Description ── */}
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </FieldLabel>
              <Textarea
                placeholder="A short description visible to students…"
                className="resize-y"
                rows={3}
                {...field}
              />
              <FieldDescription>
                Helps students identify the right classroom.
              </FieldDescription>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <div className="flex gap-2 flex-col space-y-2 md:flex-row">
          <Button type="submit" disabled={loading}>
            {loading && (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            )}
            {loading
              ? isEditing
                ? "Saving…"
                : "Creating…"
              : isEditing
                ? "Save changes"
                : "Create classroom"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onClose?.()}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
