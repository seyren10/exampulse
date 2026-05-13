import type z from "zod";
import type { loginCredentialSchema, resetPasswordSchema, userRole } from "./schema";

export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  google_id: null | string;
  avatar: null | string;
};

export type UserRole = (typeof userRole)[number];

export type LoginCredentialSchema = z.infer<typeof loginCredentialSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export type UserState = {
  user: User | null;
};
