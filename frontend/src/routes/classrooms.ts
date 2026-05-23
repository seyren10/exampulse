import type { RouteObject } from "react-router";
import { examsRoutes } from "./exams";

export const classroomRoutes: RouteObject = {
  path: "/classrooms",
  children: [
    {
      index: true,
      lazy: {
        Component: async () => (await import("@/pages/classrooms")).default,
      },
    },
    {
      path: ":classroomId",
      id: "classrooms.details",
      lazy: {
        loader: async () =>
          (await import("@/features/classrooms/loaders")).classroomDetailLoader,
        Component: async () =>
          (await import("@/pages/classrooms/details")).default,
      },
      children: [examsRoutes],
    },

    {
      path: "join/:joinCode",
      lazy: {
        loader: async () =>
          (await import("@/features/classrooms/loaders")).joinClassroomLoader,
      },
    },
  ],
};
