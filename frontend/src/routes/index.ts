import { AppLayout } from "@/layouts/app-layout";
import { Dashboard } from "@/pages/dashboard";
import { createBrowserRouter } from "react-router";
import { authRoutes } from "./auth";

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "/classrooms",
        lazy: {
          Component: async () => (await import("@/pages/classrooms")).default,
        },
      },
      {
        path: "/exams",
        lazy: {
          Component: async () => (await import("@/pages/exams")).default,
        },
      },
      {
        path: "/messages",
        lazy: {
          Component: async () => (await import("@/pages/messages")).default,
        },
      },
    ],
  },
  authRoutes,
]);

export default router;
