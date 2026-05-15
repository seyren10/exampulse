import { AppLayout } from "@/layouts/app-layout";
import { Dashboard } from "@/pages/dashboard";
import { createBrowserRouter, replace } from "react-router";
import { authRoutes } from "./auth";
import { getUserLoader } from "@/features/auth/loaders";
import { classroomRoutes } from "./classrooms";
import { examsRoutes } from "./exams";

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
      classroomRoutes,
      examsRoutes,
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
