import { httpClient } from "@/services/axios";
import type {
  LoginCredentialPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from "./type";

export const getUser = async () => {
  const res = await httpClient.get<User>("/api/user");
  return res.data;
};

export const registerUser = async (user: RegisterPayload) => {
  const res = await httpClient.post<User>("/register", user);
  return res.data;
};
export const logoutUser = async () => {
  await httpClient.post("/logout");
};

export const login = async (credentials: LoginCredentialPayload) => {
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

export const forgotPassword = async (email: string) => {
  await httpClient.post("/forgot-password", { email });
};

export const resetPassword = async (data: ResetPasswordPayload) => {
  const { email, password, password_confirmation, token } = data;

  await httpClient.post("/reset-password", {
    token,
    email,
    password,
    password_confirmation,
  });
};
