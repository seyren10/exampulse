import { httpClient } from "@/services/axios";
import type {
  Classroom,
  ClassroomSchema,
  GetClassroomsQueryParams,
} from "./type";
import type { LaravelPaginateResource } from "@/types/common";

export const getClassrooms = async (params?: GetClassroomsQueryParams) => {
  const res = await httpClient.get<LaravelPaginateResource<Classroom>>(
    "/api/v1/classrooms",
    {
      params,
    },
  );
  return res.data;
};

export const createClassroom = async (payload: ClassroomSchema) => {
  const res = await httpClient.post("/api/v1/classrooms", payload);
  return res.data;
};
export const updateClassroom = async (
  classroomId: number,
  payload: ClassroomSchema,
) => {
  const res = await httpClient.put(
    `/api/v1/classrooms/${classroomId}`,
    payload,
  );
  return res.data;
};
export const deleteClassroom = async (classroomId: number) => {
  const res = await httpClient.delete(`/api/v1/classrooms/${classroomId}`);
  return res.data;
};
