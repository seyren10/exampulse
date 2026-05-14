import type { RouteObject } from "react-router";

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
      lazy: {
        Component: async () =>
          (await import("@/pages/classrooms/details")).default,
        loader: async () =>
          (await import("@/features/classrooms/loaders")).classroomDetailLoader,
      },
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
