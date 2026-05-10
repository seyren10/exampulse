import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, CheckCircle } from "lucide-react";
import type { ExampulseError } from "@/types/common";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // TODO: API call to send reset link
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSent(true);
    } catch (err: unknown) {
      const exampulseError = err as ExampulseError;
      setError(
        exampulseError.response?.data?.message || "Failed to send reset link",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
        </div>

        <Button className="w-full" asChild>
          <Link to="/auth/login">Back to login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <KeyRound className="h-6 w-6 text-primary" />
        </div>
      </div>

      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl font-bold">Forgot password?</h1>
        <p className="text-muted-foreground">
          No worries, we'll send you reset instructions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <Button variant="ghost" className="w-full" asChild>
        <Link to="/auth/login">Back to login</Link>
      </Button>
    </div>
  );
}
