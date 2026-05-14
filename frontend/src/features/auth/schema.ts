import { ACCOUNT_TYPE } from "@/constants";
import z from "zod";

export const USER_ROLE = ["student", "teacher"] as const;

export const loginCredentialSchema = z.object({
  email: z.email(),
  password: z.string().nonempty("Password is required"),
  remember: z.boolean().optional(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().nullable(),
    email: z.email().nullable(),
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, { message: "Password must be at least 8 characters." }),
    password_confirmation: z.string().nonempty("Confirm password is required"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password"],
  });

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters." })
      .max(64, { message: "Name must be 64 characters or fewer." }),
    email: z.email().nonempty("Email is required"),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    password_confirmation: z.string().nonempty("Please confirm your password."),
    role: z.enum(ACCOUNT_TYPE),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password"],
  });
