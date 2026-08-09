import {
  mockAiInsight,
  studentDashboardDataByStudentId,
  studentGradesDataByStudentId,
  studentProfileDataByStudentId,
  studentReportDataByStudentId,
} from "../data/studentData";
import { getStoredUser } from "../stores/authStore";

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

function requireCurrentStudent() {
  const user = getStoredUser();
  if (!user || user.role !== "student") throw new Error("UNAUTHORIZED_STUDENT_ACCESS");
  return user;
}

export async function getStudentDashboard() {
  await wait(350);
  const user = requireCurrentStudent();
  const studentDashboardData = studentDashboardDataByStudentId[user.id];
  if (!studentDashboardData) throw new Error("STUDENT_DATA_NOT_FOUND");
  return {
    ...studentDashboardData,
    subjects: studentDashboardData.subjects.map((subject) => ({ ...subject })),
  };
}

export async function getStudentAiInsight() {
  const user = requireCurrentStudent();

  // TODO: Ganti mock ini dengan endpoint AI insight saat kontrak API tersedia.
  await wait(1500);

  return {
    ...mockAiInsight,
    studentId: user.id,
  };
}

export async function getStudentGrades({ academicYear, semester }) {
  await wait(300);
  const user = requireCurrentStudent();
  const grades = studentGradesDataByStudentId[user.id];
  if (!grades) throw new Error("STUDENT_GRADES_NOT_FOUND");
  if (grades.academicYear !== academicYear || grades.semester !== semester) return [];

  return grades.subjects.map((subject) => ({
    ...subject,
    components: subject.components.map((component) => ({ ...component })),
  }));
}

export async function getStudentReport({ academicYear, semester }) {
  await wait(300);
  const user = requireCurrentStudent();
  const report = studentReportDataByStudentId[user.id];
  if (!report) throw new Error("STUDENT_REPORT_NOT_FOUND");
  if (report.academicYear !== academicYear || report.semester !== semester) return null;

  return {
    ...report,
    teacherNote: report.teacherNote.replaceAll("{studentName}", user.name),
    subjects: report.subjects.map((subject) => ({ ...subject })),
  };
}

export async function getStudentProfile() {
  await wait(250);
  const user = requireCurrentStudent();
  const profile = studentProfileDataByStudentId[user.id];
  if (!profile) throw new Error("STUDENT_PROFILE_NOT_FOUND");

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    nisn: user.nisn,
    className: user.className,
    ...profile,
  };
}
