import type z from "zod";
import type { Timestamps } from "@/types/common";
import type { optionSchema, questionSchema } from "./schema";

export type Option = Timestamps & {
  id: number;
  question_id: number;
  option_text: string;
  is_correct: boolean;
  order: number;
};

export type Question = Timestamps & {
  id: number;
  exam_id: number;
  question_text: string;
  image_path: string | null;
  points: number;
  order: number;
  is_draft: number;
  options: Option[];
};

export type QuestionSchema = z.infer<typeof questionSchema>;
export type CreateQuestionPayload = QuestionSchema;
export type OptionSchema = z.infer<typeof optionSchema>;
