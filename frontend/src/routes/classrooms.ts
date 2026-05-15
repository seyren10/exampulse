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
      id: "classrooms.details",
      lazy: {
        loader: async () =>
          (await import("@/features/classrooms/loaders")).classroomDetailLoader,
      },
      children: [
        {
          index: true,
          lazy: {
            Component: async () =>
              (await import("@/pages/classrooms/details")).default,
          },
        },
        {
          path: "exams/create",
          lazy: {
            Component: async () =>
              (await import("@/pages/classrooms/exams/create")).default,
          },
        },
      ],
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
