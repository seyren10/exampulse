import type { LaravelQueryParams } from "@/types/common";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { getQuestions } from "./api";

export const getQuestionsInfiniteQueryOptions = (
  examId: number,
  params?: LaravelQueryParams,
) =>
  infiniteQueryOptions({
    queryKey: ["exams", examId, "questions", "infinite-list", params],
    queryFn: () => getQuestions(examId, params),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page > lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined,
    enabled: !!examId,
  });
