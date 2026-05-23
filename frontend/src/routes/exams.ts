import type { RouteObject } from "react-router";
import { questionRoutes } from "./questions";

/* child route of classrooms */
export const examsRoutes: RouteObject = {
  path: "exams",
  children: [
    {
      index: true,
      lazy: {
        Component: async () => (await import("@/pages/exams")).default,
      },
    },
    {
      path: "create",
      lazy: {
        Component: async () => (await import("@/pages/exams/create")).default,
      },
    },
    {
      path: ":examId",
      id: "exams.details",
      children: [
        {
          index: true,
          lazy: {
            loader: async () =>
              (await import("@/features/exams/loader")).getExamDetailLoader,
            Component: async () =>
              (await import("@/pages/exams/details")).default,
          },
        },
        questionRoutes,
      ],
    },
  ],
};
