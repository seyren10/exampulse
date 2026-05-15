import { useRouteLoaderData } from "react-router";
import type { classroomDetailLoader } from "../loaders";

export const useClassroomIdLoaderData = () => {
  const classroomId =
    useRouteLoaderData<Awaited<ReturnType<typeof classroomDetailLoader>>>(
      "classrooms.details",
    );

  if (!classroomId) throw new Error("Classroom id not found in loader data");

  return classroomId;
};
