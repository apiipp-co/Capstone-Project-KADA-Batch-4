import {
  mockAiInsight,
  studentAttendanceDataByStudentId,
  studentDashboardDataByStudentId,
  studentGradesDataByStudentId,
  studentProfileDataByStudentId,
  studentReportDataByStudentId,
} from "../data/studentData";
import { appConfig } from "../config/env";
import { getStoredUser } from "../stores/authStore";
import { api, downloadBlob } from "./apiClient";

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

function requireCurrentStudent() {
  const user = getStoredUser();
  if (!user || user.role !== "student") throw new Error("UNAUTHORIZED_STUDENT_ACCESS");
  return user;
}

export async function getStudentDashboard() {
  const user = requireCurrentStudent();
  if (!appConfig.useMockApi) {
    const [gradesData, attendanceData] = await Promise.all([
      api.get("/student/grades"),
      api.get("/student/attendance"),
    ]);
    const subjects = gradesData?.subjects || gradesData?.items || [];
    return {
      attendancePercentage: attendanceData?.overallPercentage ?? attendanceData?.percentage ?? 0,
      subjects: subjects.map((subject) => ({
        id: subject.id || subject.subjectId,
        name: subject.name || subject.subjectName,
        score: subject.finalScore ?? subject.average ?? null,
        status: "Aktif",
        icon: "book",
        accent: "blue",
      })),
    };
  }
  await wait(350);
  const studentDashboardData = studentDashboardDataByStudentId[user.id];
  if (!studentDashboardData) throw new Error("STUDENT_DATA_NOT_FOUND");
  return {
    ...studentDashboardData,
    subjects: studentDashboardData.subjects.map((subject) => ({ ...subject })),
  };
}

export async function getStudentAiInsight() {
  const user = requireCurrentStudent();
  if (!appConfig.useMockApi) return api.post("/student/ai-insight");
  await wait(1500);

  return {
    ...mockAiInsight,
    studentId: user.id,
  };
}

export async function getStudentGrades({ academicYear, semester }) {
  const user = requireCurrentStudent();
  if (!appConfig.useMockApi) {
    const data = await api.get("/student/grades", { query: { academicYear, semester } });
    return data?.subjects || data?.items || data || [];
  }
  await wait(300);
  const grades = studentGradesDataByStudentId[user.id];
  if (!grades) throw new Error("STUDENT_GRADES_NOT_FOUND");
  if (grades.academicYear !== academicYear || grades.semester !== semester) return [];

  return grades.subjects.map((subject) => ({
    ...subject,
    components: subject.components.map((component) => ({ ...component })),
  }));
}

export async function getStudentReport({ academicYear, semester }) {
  const user = requireCurrentStudent();
  if (!appConfig.useMockApi) return api.get("/student/report-card", { query: { academicYear, semester } });
  await wait(300);
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
  const user = requireCurrentStudent();
  if (!appConfig.useMockApi) {
    return {
      ...user,
      roleLabel: "Siswa",
      joinedAt: user.joinedAt || "-",
      status: "Aktif",
    };
  }
  await wait(250);
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

export async function getStudentAttendance() {
  const user = requireCurrentStudent();
  if (!appConfig.useMockApi) return api.get("/student/attendance");
  await wait(300);
  const attendance = studentAttendanceDataByStudentId[user.id];
  if (!attendance) throw new Error("STUDENT_ATTENDANCE_NOT_FOUND");
  return attendance;
}

export async function downloadStudentReport() {
  const user = requireCurrentStudent();
  if (!appConfig.useMockApi) {
    const blob = await api.download("/student/report-card/download");
    downloadBlob(blob, `rapor-${user.nis || user.id}.pdf`);
    return;
  }

  const report = studentReportDataByStudentId[user.id];
  if (!report || report.status !== "Distributed") throw new Error("REPORT_NOT_DISTRIBUTED");
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setFontSize(18);
  doc.text("Rapor Semester EduTrack", 20, 24);
  doc.setFontSize(11);
  doc.text(`Nama: ${user.name}`, 20, 36);
  doc.text(`Periode: ${report.semester} ${report.academicYear}`, 20, 43);
  report.subjects.forEach((subject, index) => {
    doc.text(`${subject.name}: ${subject.score ?? "-"}`, 20, 56 + index * 8);
  });
  doc.save(`rapor-${user.nis || user.id}.pdf`);
}
