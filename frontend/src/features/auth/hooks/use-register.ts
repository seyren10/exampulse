import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api";

export const useRegister = () => {
  const {} = useMutation({
    mutationFn: registerUser,
  });
};
