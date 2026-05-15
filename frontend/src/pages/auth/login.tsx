import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import type { LoginCredentialPayload } from "@/features/auth/type";
import { loginCredentialSchema } from "@/features/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DevTool } from "@hookform/devtools";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useLogin } from "@/features/auth/hooks/use-login";
export default function Login() {
  const [mutate, isPending] = useLogin({
    redirect: true,
  });

  const form = useForm<LoginCredentialPayload>({
    resolver: zodResolver(loginCredentialSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const handleSubmit = form.handleSubmit((data: LoginCredentialPayload) =>
    mutate(data, {
      onError: () => {
        form.setFocus("email");
        form.reset();
      },
    }),
  );

  return (
    <div className="space-y-6">
      {/* Logo for mobile */}
      <div className="flex justify-center lg:hidden">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <FileText className="h-6 w-6" />
        </div>
      </div>

      {/* Header */}
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FieldGroup>
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="name@example.com"
                  autoFocus
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          ></Controller>
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  {...field}
                  type="password"
                  id="password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          ></Controller>

          <div className="flex items-center justify-between">
            <Controller
              control={form.control}
              name="remember"
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  orientation="horizontal"
                  className="w-fit"
                >
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                    id="remember"
                  />
                  <FieldLabel htmlFor="remember">Remember me</FieldLabel>
                </Field>
              )}
            ></Controller>
            <Link
              to="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </FieldGroup>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </Button>

        <DevTool control={form.control} />
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google Login */}
      <Button
        variant="outline"
        className="w-full"
        type="button"
        disabled={isPending}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Sign in with Google
      </Button>

      {/* Sign up link */}
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/auth/register" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
