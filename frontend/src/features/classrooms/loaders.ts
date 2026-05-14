import { replace, type LoaderFunctionArgs } from "react-router";
import { joinClassroom } from "./api";
import type { ExampulseError } from "@/types/common";

export const joinClassroomLoader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const { joinCode } = params;
    if (!joinCode) return;

    const data = await joinClassroom(joinCode);
    console.log(data);

    return replace(`/classrooms/${data.id}`);
  } catch (err) {
    const error = err as ExampulseError;

    if (error.response?.status === 404) throw replace("/classrooms");
  }
};

export const classroomDetailLoader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const { classroomId } = params;
    if (!classroomId) replace("/classrooms");

    return Number(classroomId!);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw replace("/classrooms");
  }
};
