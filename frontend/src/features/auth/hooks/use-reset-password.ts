import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../api";
import type { ExampulseError } from "@/types/common";
import { toast } from "sonner";
import type { ResetPasswordSchema } from "../type";

export const useResetPassword = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: ({
      token,
      email,
      password,
      password_confirmation,
    }: ResetPasswordSchema) =>
      resetPassword({
        email,
        password,
        password_confirmation,
        token,
      }),
    onError: (err) => {
      const error = err as ExampulseError;
      toast.error(error.response?.data.message);
    },
    onSuccess: () => {
      toast.success("Password reset successfully. Please login to continue.", {
        position: "top-center",
      });
    },
  });

  return [mutate, isPending] as const;
};
