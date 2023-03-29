import Fragment from "react";
import { Navigate } from "react-router";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
export const useUserRoles = () => {
  const userRoles = ["manager", "student", "teacher"];
  return userRoles;
};

export const RolesAuthRoute = ({ children, roles }) => {
  const { user, role } = useContext(AuthContext);
  const userRoles = useUserRoles();

  //   const canAccess = userRoles.some((userRole) => roles.includes(userRole));

  if (roles.includes(role)) return <Fragment>{children}</Fragment>;

  return <Navigate to="/login" />;
};
