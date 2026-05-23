import { AppLayout } from "@/layouts/app-layout";
import { Dashboard } from "@/pages/dashboard";
import { createBrowserRouter, replace } from "react-router";
import { authRoutes } from "./auth";
import { getUserLoader } from "@/features/auth/loaders";
import { classroomRoutes } from "./classrooms";
import { examSoloRoutes } from "./exam-solo";
import AppLoader from "@/components/app/app-loader";

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    loader: getUserLoader,
    HydrateFallback: AppLoader,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      classroomRoutes,
      examSoloRoutes,
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
  {
    path: "/exams/:examId/questions/manage",
    HydrateFallback: AppLoader,
    lazy: {
      loader: async () =>
        (await import("@/features/exams/loader")).getExamDetailQueryLoader,
      Component: async () => (await import("@/pages/questions/create")).default,
    },
  },
  authRoutes,
]);

export default router;
