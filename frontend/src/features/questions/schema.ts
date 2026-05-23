import z from "zod";

export const optionSchema = z.object({
  option_text: z.string().nonempty("Option text is required."),
  is_correct: z.boolean(),
  order: z.number().optional(),
});

export const questionSchema = z.object({
  question_text: z.string().nonempty("Question text is required."),
  image: z.instanceof(File).nullable().optional(),
  points: z.coerce
    .number<number | undefined>()
    .int()
    .min(1)
    .optional()
    .or(z.literal(undefined)),
  order: z.number().int().optional(),
  options: z
    .array(optionSchema)
    .min(2, { message: "At least 2 options are required." })
    .refine((options) => options.some((o) => o.is_correct), {
      message: "At least one option must be marked as correct.",
    }),
});
