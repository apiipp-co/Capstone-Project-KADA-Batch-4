import { appConfig } from "../config/env";
import { teacherUser } from "../data/teacherData";
import { api } from "./apiClient";

export async function getTeacherClasses() {
  if (appConfig.useMockApi) return teacherUser.assignedClasses;
  const data = await api.get("/teacher/classes");
  const classes = data.items || data.classes || data || [];
  return classes.map((item) => ({
    id: item.id || item.classId,
    name: item.name || item.className,
    subjectId: item.subjectId || item.subject?.id,
    subjectName: item.subjectName || item.subject?.name || "Mata Pelajaran",
    academicYear: item.academicYear || item.academicYearName || "",
    semester: item.semester || item.semesterName || "",
  }));
}

