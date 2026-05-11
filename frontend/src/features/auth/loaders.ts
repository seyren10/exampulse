import { queryClient } from "@/services/react-query";
import { getUserQueryOptions } from "./query";
import { redirect } from "react-router";
import { clearUser, selectUserIsVerified } from "./slice";
import { setUser } from "./slice";
import { store } from "@/store";

export const getUserLoader = async () => {
  try {
    const user = await queryClient.fetchQuery(getUserQueryOptions());

    store.dispatch(setUser(user));

    if (!selectUserIsVerified(store.getState())) {
      return redirect("/auth/verify-email");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    store.dispatch(clearUser());

    throw redirect("/auth/login");
  }
};

export const verifyEmailLoader = async () => {
  try {
    const user = await queryClient.fetchQuery(getUserQueryOptions());
    if (user.email_verified_at) {
      return redirect("/");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw redirect("/auth/login");
  }
};
