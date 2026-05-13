import z from "zod";

export const userRole = ["owner", "member"] as const;

export const loginCredentialSchema = z.object({
  email: z.email(),
  password: z.string().nonempty("Password is required"),
  remember: z.boolean().optional(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().nullable(),
    email: z.email().nullable(),
    password: z.string().nonempty("Password is required"),
    password_confirmation: z.string().nonempty("Confirm password is required"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password"],
  });
