import { useSelector } from "react-redux";
import { selectUser } from "../slice";
import type { UserRole } from "../type";
import type { ClassroomDetail } from "@/features/classrooms/type";

export const useUserPermissions = () => {
  const user = useSelector(selectUser);

  const hasPermission = (role: UserRole) => user?.role === role;

  const isClassroomOwner = (classroomId: number) =>
    hasPermission("teacher") && user?.id === classroomId;

  const isStudentOfClassroom = (classroomDetails: ClassroomDetail) => {
    const studentIds = classroomDetails.students.map((student) => student.id);
    return studentIds.includes(user?.id || 0);
  };

  return { isClassroomOwner, hasPermission, isStudentOfClassroom, user };
};
