import { useSuspenseQuery } from "@tanstack/react-query";
import { getUserQueryOptions } from "../query";

export const useUser = () => {
  const { data } = useSuspenseQuery(getUserQueryOptions());

  return data;
};
