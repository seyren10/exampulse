import { queryOptions } from "@tanstack/react-query";
import type { GetClassroomsQueryParams } from "./type";
import { getClassrooms } from "./api";

export const getClassroomsQueryOptions = (params?: GetClassroomsQueryParams) =>
  queryOptions({
    queryKey: ["classrooms", params],
    queryFn: () => getClassrooms(params),
  });
