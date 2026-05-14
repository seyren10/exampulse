import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClassroom, deleteClassroom, updateClassroom } from "../api";
import { toast } from "sonner";
import type { ExampulseError } from "@/types/common";
import type { ClassroomSchema } from "../type";

export const useCreateClassroom = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createClassroom,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      toast.success("Classroom created successfully.");
    },
    onError: (err) => {
      const error = err as ExampulseError;
      toast.error(error.response?.data.message);
    },
  });

  return [mutate, isPending] as const;
};

export const useUpdateClassroom = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({
      classroomId,
      payload,
    }: {
      classroomId: number;
      payload: ClassroomSchema;
    }) => updateClassroom(classroomId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      toast.success("Classroom updated successfully.");
    },
    onError: (err) => {
      const error = err as ExampulseError;
      toast.error(error.response?.data.message);
    },
  });

  return [mutate, isPending] as const;
};

export const useDeleteClassroom = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteClassroom,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      toast.info("Classroom deleted successfully.");
    },
    onError: (err) => {
      const error = err as ExampulseError;
      toast.error(error.response?.data.message);
    },
  });

  return [mutate, isPending] as const;
};
