import type { RouteObject } from "react-router";

export const examsRoutes: RouteObject = {
  path: "/exams",
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
      lazy: {
        Component: async () => (await import("@/pages/exams/details")).default,
      },
    },
  ],
};
