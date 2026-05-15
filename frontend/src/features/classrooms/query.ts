import { queryOptions } from "@tanstack/react-query";
import type { GetClassroomsQueryParams } from "./type";
import { getClassroomDetail, getClassrooms } from "./api";

export const getClassroomsQueryOptions = (params?: GetClassroomsQueryParams) =>
  queryOptions({
    queryKey: ["classrooms", params],
    queryFn: () => getClassrooms(params),
  });

export const getClassroomDetailOptions = (classroomId: number) =>
  queryOptions({
    queryKey: ["classrooms", classroomId],
    queryFn: () => getClassroomDetail(classroomId),
  });
