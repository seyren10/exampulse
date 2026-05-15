import type { Timestamps } from "@/types/common";
import type { EXAM_TYPE, examSchema } from "./schema";
import type z from "zod";

export type ExamType = (typeof EXAM_TYPE)[number];
export type Exam = Timestamps & {
  id: number;
  classroom_id: number;
  title: string;
  description: string;
  type: ExamType;
  time_limit: number;
  scheduled_at: string;
  deadline: string | null;
  is_published: boolean;
};

export type ExamSchema = z.infer<typeof examSchema>;
export type CreateExamPayload = ExamSchema;
export type UpdateExamPayload = Partial<CreateExamPayload>;
