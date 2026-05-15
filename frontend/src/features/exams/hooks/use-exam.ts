import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExam } from "../api";
import { toast } from "sonner";
import { onErrorWithToast } from "@/lib/helpers";
import type { ExamSchema } from "../type";

export const useCreateExam = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      classroomId,
      payload,
    }: {
      classroomId: number;
      payload: ExamSchema;
    }) => createExam(classroomId, payload),
    onSuccess: () => {
      toast.info("exam created successfully.");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["classrooms", "exams"] }),
    onError: onErrorWithToast,
  });

  return [mutate, isPending] as const;
};
