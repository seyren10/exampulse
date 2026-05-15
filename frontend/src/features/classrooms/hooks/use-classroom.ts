import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createClassroom,
  deleteClassroom,
  joinClassroom,
  leaveClassroom,
  updateClassroom,
} from "../api";
import { toast } from "sonner";
import type { ClassroomSchema } from "../type";
import { onErrorWithToast } from "@/lib/helpers";

export const useCreateClassroom = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createClassroom,
    onSuccess: async () => {
      toast.success("Classroom created successfully.");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["classrooms"] }),
    onError: onErrorWithToast,
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
      toast.success("Classroom updated successfully.");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["classrooms"] }),
    onError: onErrorWithToast,
  });

  return [mutate, isPending] as const;
};

export const useDeleteClassroom = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteClassroom,
    onSuccess: async (_, classroomId) => {
      queryClient.removeQueries({
        queryKey: ["classrooms", classroomId],
      });
      toast.info("Classroom deleted successfully.");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["classrooms"] }),
    onError: onErrorWithToast,
  });

  return [mutate, isPending] as const;
};

export const useJoinClassroom = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: joinClassroom,
    onSuccess: (classroom) => {
      toast.success(`You've joined the classroom ${classroom.name}!`);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["classrooms"] }),
    onError: onErrorWithToast,
  });

  return [mutate, isPending] as const;
};
export const useLeaveClassroom = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: leaveClassroom,
    onSuccess: (_, classroomId) => {
      queryClient.removeQueries({
        queryKey: ["classrooms", classroomId],
      });
      toast.info(`You've left the classroom`);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["classrooms"] }),
    onError: onErrorWithToast,
  });

  return [mutate, isPending] as const;
};
