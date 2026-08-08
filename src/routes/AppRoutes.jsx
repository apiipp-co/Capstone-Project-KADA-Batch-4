import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardPage from "../pages/DashboardPage";
import ForbiddenPage from "../pages/ForbiddenPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import TeacherAccountPage from "../pages/teacher/TeacherAccountPage";
import TeacherAttendancePage from "../pages/teacher/TeacherAttendancePage";
import ChangePasswordPage from "../pages/teacher/ChangePasswordPage";
import TeacherDashboardPage from "../pages/teacher/TeacherDashboardPage";
import TeacherGradesPage from "../pages/teacher/TeacherGradesPage";
import TeacherHomeroomReportsPage from "../pages/teacher/TeacherHomeroomReportsPage";
import TeacherReportsPage from "../pages/teacher/TeacherReportsPage";
import TeacherStudentReportPage from "../pages/teacher/TeacherStudentReportPage";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/403" element={<ForbiddenPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route element={<RoleRoute allowedRoles={["teacher"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
            <Route path="/teacher/attendance" element={<TeacherAttendancePage />} />
            <Route path="/teacher/grades" element={<TeacherGradesPage />} />
            <Route path="/teacher/reports" element={<TeacherReportsPage />} />
            <Route path="/teacher/reports/:studentId" element={<TeacherStudentReportPage />} />
            <Route path="/teacher/homeroom/reports" element={<TeacherHomeroomReportsPage />} />
            <Route path="/teacher/homeroom/reports/:studentId" element={<TeacherHomeroomReportsPage />} />
            <Route path="/teacher/account" element={<TeacherAccountPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
