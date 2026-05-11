import { getUserQueryOptions } from "@/features/auth/query";
import { queryClient } from "@/services/react-query";
import { replace } from "react-router";

export default async function () {
  try {
    const user = await queryClient.fetchQuery(getUserQueryOptions());
    if (user) {
      return replace("/");
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}
