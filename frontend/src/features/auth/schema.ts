import z from "zod";

export const userRole = ["owner", "member"] as const;

export const loginCredentialSchema = z.object({
  email: z.email(),
  password: z.string().nonempty('Password is required'),
  remember: z.boolean().optional(),
});

