import {
  keepPreviousData,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
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
    },
  },
});
