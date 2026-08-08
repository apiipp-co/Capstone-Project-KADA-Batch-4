import { Navigate, Outlet } from "react-router-dom";
import { getStoredUser } from "../stores/authStore";

export default function RoleRoute({ allowedRoles }) {
  const user = getStoredUser();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }
  return <Outlet />;
}
