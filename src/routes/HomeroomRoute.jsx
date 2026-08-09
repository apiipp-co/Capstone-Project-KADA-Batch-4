import { Navigate, Outlet } from "react-router-dom";
import { getStoredUser } from "../stores/authStore";

export default function HomeroomRoute() {
  const user = getStoredUser();
  if (user?.role !== "teacher" || !user.isHomeroomTeacher || !user.homeroomClass?.id) {
    return <Navigate to="/teacher/dashboard" replace />;
  }
  return <Outlet />;
}
