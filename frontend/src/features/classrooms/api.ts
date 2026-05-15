import { httpClient } from "@/services/axios";
import type {
  Classroom,
  ClassroomDetail,
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

export const getClassroomDetail = async (classroomId: number) => {
  const res = await httpClient.get<ClassroomDetail>(
    `/api/v1/classrooms/${classroomId}`,
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

export const joinClassroom = async (joinCode: string) => {
  const res = await httpClient.post<Classroom>("/api/v1/classrooms/join", {
    code: joinCode,
  });
  return res.data;
};
export const leaveClassroom = async (classroomId: number) => {
  await httpClient.delete<Classroom>(`/api/v1/classrooms/${classroomId}/leave`);
};
