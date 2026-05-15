import { isFuture } from "date-fns";
import z from "zod";

export const EXAM_TYPE = ["live", "async"] as const;

export const examSchema = z
  .object({
    title: z
      .string()
      .min(1, { message: "Title is required." })
      .max(255, { message: "Title must be 255 characters or fewer." }),
    description: z.string().optional(),
    type: z.enum(EXAM_TYPE),
    time_limit: z.coerce
      .number<number | "" | undefined>()
      .optional()
      .or(z.literal(""))
      .refine((v) => !v || (Number(v) >= 1 && Number.isInteger(Number(v))), {
        message: "Time limit must be a whole number of at least 1.",
      }),
    scheduled_at: z
      .string()
      .optional()
      .refine(
        (v) => {
          if (!v) return true;
          if (isFuture(new Date(v))) return true;
          return false;
        },
        {
          error: "Scheduled date must be in the future.",
        },
      ),
    deadline: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "live") return true;
      if (!data.deadline || !data.scheduled_at) return true;
      return new Date(data.deadline) > new Date(data.scheduled_at);
    },
    {
      message: "Deadline must be after the scheduled date.",
      path: ["deadline"],
    },
  );
