import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createClassroom,
  deleteClassroom,
  joinClassroom,
  updateClassroom,
} from "../api";
import { toast } from "sonner";
import type { ExampulseError } from "@/types/common";
import type { ClassroomSchema } from "../type";

const onError = (err: Error) => {
  const error = err as ExampulseError;
  toast.error(error.response?.data.message);
};

export const useCreateClassroom = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createClassroom,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      toast.success("Classroom created successfully.");
    },
    onError,
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
    onError,
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
    onError,
  });

  return [mutate, isPending] as const;
};

export const useJoinClassroom = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: joinClassroom,
    onSuccess: (classroom) => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      toast.success(`You've joined the classroom ${classroom.name}!`);
    },
    onError,
  });

  return [mutate, isPending] as const;
};
