import { queryOptions } from "@tanstack/react-query";
import { getUser } from "./api";

export const getUserQueryOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 1000 * 60 * 120, // 2 hours
    retry: false,
    retryOnMount: false,
  });
