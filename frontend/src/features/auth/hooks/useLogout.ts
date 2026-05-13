import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../api";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export const useLogout = (option?: { redirect?: boolean }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: logoutUser,
    onSuccess: async () => {
      await queryClient.resetQueries();
      
      toast.info("You have successfully logged out.");

      if (option?.redirect) {
        navigate("/auth/login", {
          replace: true,
        });
      }
    },
  });

  return [mutate, isPending] as const;
};
