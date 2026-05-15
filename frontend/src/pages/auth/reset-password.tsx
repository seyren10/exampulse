import { Link, useNavigate, useSearchParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import type { ResetPasswordPayload } from "@/features/auth/type";
import { resetPasswordSchema } from "@/features/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { useResetPassword } from "@/features/auth/hooks/use-reset-password";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [mutate, isPending] = useResetPassword();

  const form = useForm<ResetPasswordPayload>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      email,
      password: "",
      password_confirmation: "",
    },
  });

  const handleSubmit = form.handleSubmit((data) =>
    mutate(data, {
      onSuccess: () => {
        navigate("/auth/login", {
          replace: true,
        });
      },
    }),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <KeyRound className="h-6 w-6 text-primary" />
        </div>
      </div>

      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl font-bold">Set new password</h1>
        <p className="text-muted-foreground">
          Your new password must be different from previously used passwords
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FieldGroup>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                <Input
                  {...field}
                  placeholder="Enter new password"
                  type="password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password_confirmation"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                <Input
                  {...field}
                  placeholder="Enter new password"
                  type="password"
                />
                <FieldDescription>Password must match above</FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="space-y-2">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Resetting..." : "Reset password"}
            </Button>
            <Button type="button" className="w-full" variant="link" asChild>
              <Link to="/auth/login">Back to login</Link>
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
