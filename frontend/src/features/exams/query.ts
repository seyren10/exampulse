import { queryOptions } from "@tanstack/react-query";
import { getExamDetails, getExams } from "./api";

export const getExamsQueryOptions = (classroomId: number) =>
  queryOptions({
    queryKey: ["classrooms", classroomId, "exams"],
    queryFn: () => getExams(classroomId),
  });
export const getExamDetailQueryOptions = (examId: number) =>
  queryOptions({
    queryKey: ["exams", examId],
    queryFn: () => getExamDetails(examId),
  });
