import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { QuestionSchema } from "../type";
import { createQuestion } from "../api";
import { toast } from "sonner";
import { onErrorWithToast } from "@/lib/helpers";

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      examId,
      payload,
    }: {
      examId: number;
      payload: QuestionSchema;
    }) => createQuestion(examId, payload),
    onSuccess: () => {
      toast.info("A new question has been added.");
    },
    onSettled: (_data, _errors, vars) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({
        queryKey: ["exams", vars.examId, "exams"],
      });
    },
    onError: onErrorWithToast,
  });

  return [mutate, isPending] as const;
};
