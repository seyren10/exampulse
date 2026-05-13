import { AuthLayout } from "@/layouts/auth-layout";
import { replace, type RouteObject } from "react-router";

export const authRoutes: RouteObject = {
  path: "/auth",
  Component: AuthLayout,
  children: [
    {
      //redirect to login if the path is /auth
      index: true,
      loader: () => replace("/auth/login"),
    },
    {
      // GUEST ROUTES
      path: "",
      lazy: {
        loader: async () => (await import("./guards/guest")).default,
      },
      children: [
        {
          path: "login",
          lazy: {
            Component: async () => (await import("@/pages/auth/login")).default,
          },
        },
        {
          path: "register",
          lazy: {
            Component: async () =>
              (await import("@/pages/auth/register")).default,
          },
        },
        {
          path: "forgot-password",
          lazy: {
            Component: async () =>
              (await import("@/pages/auth/forgot-password")).default,
          },
        },
        {
          path: "reset-password",
          lazy: {
            Component: async () =>
              (await import("@/pages/auth/reset-password")).default,
          },
        },
      ],
    },
    {
      path: "verify-email",
      lazy: {
        Component: async () =>
          (await import("@/pages/auth/verify-email")).default,
        loader: async () =>
          (await import("@/features/auth/loaders")).verifyEmailLoader,
      },
    },
    {
      path: "*",
      loader: () => replace("/auth/login"),
    },
  ],
};
