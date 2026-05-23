import { httpClient } from "@/services/axios";
import type { CreateExamPayload, Exam } from "./type";
import type { LaravelPaginateResource } from "@/types/common";

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
export const getExams = async (classroomId: number) => {
  const res = await httpClient.get<LaravelPaginateResource<Exam>>(
    `/api/v1/classrooms/${classroomId}/exams`,
  );
  return res.data;
};
export const getExamDetails = async (examId: number) => {
  const res = await httpClient.get<Exam>(`/api/v1/exams/${examId}`);
  return res.data;
};
