import { httpClient } from "@/services/axios";
import type { LoginCredential, User } from "./type";

export const getUser = async () => {
  const res = await httpClient.get<User>("/api/user");
  return res.data;
};

export const logoutUser = async () => {
  await httpClient.post("/logout");
};

export const login = async (credentials: LoginCredential) => {
  await csrfCookie();
  await httpClient.post("/login", credentials);
};

export const csrfCookie = async () =>
  await httpClient.get("/sanctum/csrf-cookie");

export const sendEmailVerification = async () => {
  const res = await httpClient.post<{ status: string }>(
    "/email/verification-notification",
  );

  return res.data;
};
