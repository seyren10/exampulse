import { AppLayout } from "@/layouts/app-layout";
import { Dashboard } from "@/pages/dashboard";
import { createBrowserRouter, replace } from "react-router";
import { authRoutes } from "./auth";
import { getUserLoader } from "@/features/auth/loaders";

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    loader: getUserLoader,
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
  {
    path: "/dashboard",
    loader: ({ request }) => {
      const { search } = new URL(request.url);
      return replace(`/${search}`);
    },
  },
  authRoutes,
]);

export default router;
