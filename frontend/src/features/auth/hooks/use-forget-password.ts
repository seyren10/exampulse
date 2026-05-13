import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../api";
import type { ExampulseError } from "@/types/common";
import { toast } from "sonner";

export const useForgotPassword = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onError: (err) => {
      const error = err as ExampulseError;
      toast.error(error.response?.data.message);
    },
  });

  return [mutate, isPending] as const;
};
