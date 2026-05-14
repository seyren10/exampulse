import { useSelector } from "react-redux";
import { selectUser } from "../slice";
import type { UserRole } from "../type";

export const useUserPermissions = () => {
  const user = useSelector(selectUser);

  const hasPermission = (role: UserRole) => user?.role === role;

  return { hasPermission, user };
};
