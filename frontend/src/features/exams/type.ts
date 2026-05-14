import type { Timestamps } from "@/types/common";
import type { EXAM_TYPE } from "./schema";

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
