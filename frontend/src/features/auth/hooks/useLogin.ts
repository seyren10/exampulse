import { useMutation } from "@tanstack/react-query";
import { login } from "../api";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import type { ExampulseError } from "@/types/common";

export const useLogin = (options?: { redirect?: boolean }) => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onError: (error) => {
      toast.error(`Login failed`, {
        description: (error as ExampulseError).response?.data.message,
        position: "top-center",
      });
    },
    onSuccess: () => {
      if (options?.redirect) {
        navigate("/", { replace: true });
      }
    },
  });

  return [mutate, isPending] as const;
};
