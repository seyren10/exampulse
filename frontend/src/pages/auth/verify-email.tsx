import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";

export default function VerifyEmail() {
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    try {
      // TODO: API call to resend verification email
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResent(true);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="text-muted-foreground">
          We've sent a verification link to your email address. Please check
          your inbox and click the link to verify your account.
        </p>
      </div>

      {resent && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 p-4 text-sm text-primary">
          <CheckCircle className="h-4 w-4" />
          <span>Verification email resent successfully!</span>
        </div>
      )}

      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleResend}
          disabled={isResending || resent}
        >
          {isResending
            ? "Resending..."
            : resent
              ? "Email sent!"
              : "Resend verification email"}
        </Button>

        <Link to="/login">
          <Button variant="ghost" className="w-full">
            Back to login
          </Button>
        </Link>
      </div>

      <p className="text-sm text-muted-foreground">
        Didn't receive the email? Check your spam folder or{" "}
        <button
          onClick={handleResend}
          className="text-primary hover:underline"
          disabled={isResending}
        >
          resend
        </button>
      </p>
    </div>
  );
}
