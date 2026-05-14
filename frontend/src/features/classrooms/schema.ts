import z from "zod";

export const classroomSchema = z.object({
  name: z
    .string()
    .nonempty("Classroom name is required.")
    .max(255, { message: "Name must be 255 characters or fewer." }),
  description: z
    .string()
    .max(1000, { message: "Description must be 1000 characters or fewer." })
    .optional(),
});
