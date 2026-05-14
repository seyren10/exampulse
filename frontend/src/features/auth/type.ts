import type z from "zod";
import type {
  loginCredentialSchema,
  registerSchema,
  resetPasswordSchema,
  USER_ROLE,
} from "./schema";

export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  google_id: null | string;
  avatar: null | string;
  role: UserRole;
};

export type Teacher = {
  id: number;
  name: string;
  email: string;
};

export type StudentPivot = {
  classroom_id: number;
  student_id: number;
  created_at: string;
  updated_at: string;
  joined_at: string;
};

export type Student = {
  id: number;
  name: string;
  email: string;
  pivot: StudentPivot;
};

export type UserRole = (typeof USER_ROLE)[number];

export type LoginCredentialSchema = z.infer<typeof loginCredentialSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;

export type UserState = {
  user: User | null;
};
