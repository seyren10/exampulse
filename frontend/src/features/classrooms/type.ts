import type { LaravelQueryParams, Timestamps } from "@/types/common";
import type z from "zod";
import type { classroomSchema } from "./schema";
import type { Exam } from "../exams/type";
import type { Student, Teacher } from "../auth/type";

export type GetClassroomsQueryParams = LaravelQueryParams & {};

export type Classroom = Timestamps & {
  id: number;
  teacher_id: number;
  name: string;
  code: string;
  description: string | null;
  is_active: boolean;
  students_count: number;
  exams_count: number;
};
export type ClassroomDetail = Timestamps &
  Classroom & {
    teacher: Teacher;
    students: Student[];
    exams: Exam[];
  };

export type ClassroomSchema = z.infer<typeof classroomSchema>;
export type CreateClassroomSchema = ClassroomSchema;
export type UpdateClassroomSchema = Partial<CreateClassroomSchema>;
