import { useRouteLoaderData } from "react-router";
import type { getExamDetailLoader } from "../loader";

export const useExamLoaderData = () => {
  const examId =
    useRouteLoaderData<Awaited<ReturnType<typeof getExamDetailLoader>>>(
      "exams.details",
    );

  if (!examId) throw new Error("Exam id not found in loader data");

  return examId;
};
