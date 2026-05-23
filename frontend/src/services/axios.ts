import router from "@/routes";
import Axios from "axios";
import { queryClient } from "./react-query";
export const httpClient = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: "application/json",
  },
});

let isRedirecting = false;

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isAuthRoute = router.state.location.pathname.startsWith("/auth");

    if (error.response?.status === 401 && !isAuthRoute) {
      if (!isRedirecting) {
        isRedirecting = true;
        queryClient.clear();
        await router.navigate("/auth/login", { replace: true });
        isRedirecting = false;
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);
