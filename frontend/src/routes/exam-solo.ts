import type { RouteObject } from "react-router";

export const examSoloRoutes: RouteObject = {
  path: "/exams",
  children: [
    {
      index: true,
      lazy: {
        Component: async () =>
          (await import("@/pages/exams/solo-index")).default,
      },
    },
    {
      path: "create",
      lazy: {
        Component: async () =>
          (await import("@/pages/exams/solo-create")).default,
      },
    },
    {
      path: ":examId",
      children: [
        {
          index: true,
          lazy: {
            Component: async () =>
              (await import("@/pages/exams/solo-details")).default,
          },
        },
      ],
    },
  ],
};
