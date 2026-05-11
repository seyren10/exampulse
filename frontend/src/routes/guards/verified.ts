import { getUserQueryOptions } from "@/features/auth/query";
import { queryClient } from "@/services/react-query";
import { redirect } from "react-router";

export default async function () {
  try {
    const user = await queryClient.fetchQuery(getUserQueryOptions());
    if (!user.email_verified_at) {
      return redirect("/auth/verify-email");
    }
  } catch (error) {
    throw redirect("/auth/login");
  }
}
