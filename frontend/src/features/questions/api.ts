import { httpClient } from "@/services/axios";
import type { CreateQuestionPayload, Question, QuestionSchema } from "./type";
import type {
  LaravelPaginateResource,
  LaravelQueryParams,
} from "@/types/common";

export const getQuestions = async (
  examId: number,
  params?: LaravelQueryParams,
) => {
  const res = await httpClient.get<LaravelPaginateResource<Question>>(
    `/api/v1/exams/${examId}/questions`,
    {
      params,
    },
  );
  return res.data;
};
export const createQuestion = async (
  examId: number,
  payload: CreateQuestionPayload,
) => {
  const res = await httpClient.post<QuestionSchema>(
    `/api/v1/exams/${examId}/questions`,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return res.data;
};
