import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  GraduationCap,
  BookOpen,
  Loader2,
  Zap,
  AlertCircle,
} from "lucide-react";
import { registerSchema } from "@/features/auth/schema";
import type { RegisterPayload, User } from "@/features/auth/type";
import { registerUser } from "@/features/auth/api";
import type { ExampulseError } from "@/types/common";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Link, useNavigate } from "react-router";

export default function RegisterForm() {
  const navigate = useNavigate();
  const form = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: "student",
    },
  });

  const { mutate, isPending, isError, error } = useMutation<
    User,
    ExampulseError,
    RegisterPayload
  >({
    mutationFn: registerUser,
    onSuccess: () => {
      navigate("/auth/verify-email");
    },
  });

  const handleSubmit = form.handleSubmit((data) => mutate(data));

  // ── Form ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        {/* ── Header ── */}
        <CardHeader className="pb-2">
          <div className="mb-1 flex items-center gap-2">
            <Zap className="size-5 text-primary" />
            <span className="text-sm font-semibold tracking-widest text-primary uppercase">
              ExamPulse
            </span>
          </div>
          <CardTitle className="text-2xl font-bold">
            Create your account
          </CardTitle>
          <CardDescription>
            Join live quiz sessions or schedule async exams — pick your role
            below.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          {/* ── Server Error ── */}
          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                {error.response?.data?.message || "Something went wrong"}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FieldGroup>
              {/* ── Role Toggle ── */}
              <Controller
                control={form.control}
                name="role"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>I am a…</FieldLabel>
                    <ToggleGroup
                      type="single"
                      value={field.value}
                      onValueChange={(val) => val && field.onChange(val)}
                      className="grid grid-cols-2 gap-2"
                    >
                      <ToggleGroupItem
                        value="student"
                        aria-label="Student"
                        className="flex flex-col gap-1 h-auto py-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                      >
                        <GraduationCap className="size-5" />
                        <span className="text-xs font-medium">Student</span>
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="teacher"
                        aria-label="Teacher"
                        className="flex flex-col gap-1 h-auto py-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                      >
                        <BookOpen className="size-5" />
                        <span className="text-xs font-medium">Teacher</span>
                      </ToggleGroupItem>
                    </ToggleGroup>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Separator />

              {/* ── Name ── */}
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                    <Input
                      placeholder="Alex Rivera"
                      autoComplete="name"
                      {...field}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              {/* ── Email ── */}
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@school.edu"
                      autoComplete="email"
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              {/* ── Password ── */}
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      {...field}
                    />
                    <FieldDescription>At least 8 characters</FieldDescription>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              {/* ── Confirm Password ── */}
              <Controller
                control={form.control}
                name="password_confirmation"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      {...field}
                    />
                    <FieldDescription>
                      Password must match above
                    </FieldDescription>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              {/* ── Submit ── */}
              <Button
                type="submit"
                className="mt-2 w-full"
                disabled={isPending}
              >
                {isPending && (
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                )}
                {isPending ? "Creating account…" : "Create account"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="justify-center pb-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
