import { queryClient } from "@/services/react-query";
import { replace, type LoaderFunctionArgs } from "react-router";
import { getExamDetailQueryOptions } from "./query";

export const getExamDetailLoader = ({ params }: LoaderFunctionArgs) => {
  try {
    const { classroomId, examId } = params;
    console.log(classroomId, examId);
    if (!classroomId) replace("/classrooms");
    if (!examId) replace(`/classrooms/${classroomId}`);

    return Number(examId!);
  } catch (err) {
    throw replace("/classrooms");
  }
};


export const getExamDetailQueryLoader = async ({
  params,
}: LoaderFunctionArgs) => {
  try {
    const { examId } = params;

    if (!examId) replace(`/classrooms/`);

    await queryClient.ensureQueryData(getExamDetailQueryOptions(+examId!));

    return +examId!;
  } catch (err) {
    throw replace("/classrooms");
  }
};
