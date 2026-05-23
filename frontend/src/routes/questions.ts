import type { RouteObject } from "react-router";

/* child route of exams */
export const questionRoutes: RouteObject = {
  path: "questions",
  children: [
    {
      index: true,
      lazy: {
        Component: async () => (await import("@/pages/questions")).default,
      },
    },
    {
      path: "create",
      lazy: {
        Component: async () =>
          (await import("@/pages/questions/create")).default,
      },
    },
  ],
};
