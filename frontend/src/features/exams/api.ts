import { httpClient } from "@/services/axios";
import type { CreateExamPayload, Exam } from "./type";

export const createExam = async (
  classroomId: number,
  payload: CreateExamPayload,
) => {
  const res = await httpClient.post<Exam>(
    `/api/v1/classrooms/${classroomId}/exams`,
    payload,
  );
  return res.data;
};
