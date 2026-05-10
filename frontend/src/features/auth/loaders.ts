import { queryClient } from "@/services/react-query";
import { getUserQueryOptions } from "./query";
import { AxiosError } from "axios";
import { redirect } from "react-router";

export const getUserLoader = async () => {
  try {
    await queryClient.ensureQueryData(getUserQueryOptions());
  } catch (error) {
    if (error instanceof AxiosError) return redirect("/login");
  }
};
