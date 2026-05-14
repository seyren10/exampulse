import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Hash, Loader2 } from "lucide-react";
import { useJoinClassroom } from "@/features/classrooms/hooks/use-classroom";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";

type JoinDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export default function JoinDialog({ open, onOpenChange }: JoinDialogProps) {
  const form = useForm({
    resolver: zodResolver(
      z.object({
        code: z.string().nonempty(),
      }),
    ),
  });

  const [mutate, isPending] = useJoinClassroom();

  const handleSubmit = form.handleSubmit((data) => mutate(data.code));

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isPending) {
          form.reset();
          onOpenChange(next);
        }
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Join a classroom</DialogTitle>
          <DialogDescription>
            Enter the room code your teacher shared with you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FieldGroup>
            <Controller
              control={form.control}
              name="code"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Classroom code</FieldLabel>
                  <div className="relative">
                    <Hash className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      className="pl-9 font-mono tracking-widest uppercase"
                      placeholder="LGXxbO7H"
                      autoComplete="off"
                      autoFocus
                      {...field}
                    />
                  </div>
                  <FieldDescription>
                    Room codes are case-insensitive.
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                onOpenChange(false);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              )}
              {isPending ? "Joining…" : "Join classroom"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
