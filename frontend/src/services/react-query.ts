import type { ExampulseError } from "@/types/common";
import {
  keepPreviousData,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const err = error as ExampulseError;

      // 401 is now handled by the Axios interceptor — skip it here
      if (err.response?.status === 401) return;

      if (query.state.data !== undefined)
        toast.error(`Something went wrong: ${error.message}`, {
          action: {
            label: "Retry",
            onClick: () => query.reset(),
          },
        });
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour
      placeholderData: keepPreviousData,
      /* Retry 3 times if the request fails except for 401 */
      retry: (failureCount, error) => {
        const err = error as ExampulseError;
        if (err.response?.status === 401) return false;
        return failureCount < 3;
      },
    },
  },
});
