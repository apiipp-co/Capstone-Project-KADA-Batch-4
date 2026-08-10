import {
  defaultLearningTopics,
  GRADE_STATUSES,
  gradeStudents,
  homeroomFinalGrades,
  homeroomSubjects,
  initialGrades,
} from "../data/gradeData";
import { teacherUser } from "../data/teacherData";
import { appConfig } from "../config/env";
import { getStoredUser } from "../stores/authStore";
import { canViewClassSubjectGrades } from "../utils/teacherPermissions";
import {
  getGradeDraft,
  getOfficialGradeRecord,
  getTopicRecord,
  saveGradeDraftRecord,
  saveOfficialGradeRecord,
  saveTopicRecord,
} from "../stores/gradeStore";
import { api } from "./apiClient";

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

function normalizeSemester(value) {
  return String(value).toUpperCase();
}

function resolveAssignment(filters) {
  const assignedClass = teacherUser.assignedClasses.find(
    (item) =>
      item.id === filters.classId &&
      item.subjectId === filters.subjectId &&
      item.academicYear === filters.academicYear &&
      normalizeSemester(item.semester) === normalizeSemester(filters.semester),
  );

  if (!assignedClass) throw new Error("UNAUTHORIZED_ASSIGNMENT");

  return {
    assignmentId: assignedClass.id === "CLS-001" ? "ASN-001" : "ASN-002",
    ...assignedClass,
  };
}

export async function getGradeSheet(filters) {
  if (!appConfig.useMockApi) {
    const data = await api.get(`/teacher/classes/${filters.classId}/grades`);
    const grades = data.grades || {};
    (data.entries || []).forEach((entry) => {
      grades[entry.studentId] ||= {};
      grades[entry.studentId][entry.componentCode] = entry.score;
    });
    return {
      assignment: data.assignment || { ...filters, assignmentId: data.assignmentId || filters.classId },
      students: data.students || [],
      grades,
      localDraft: getGradeDraft(filters),
      status: data.status || GRADE_STATUSES.DRAFT,
      savedAt: data.savedAt || null,
    };
  }
  await wait(650);
  const assignment = resolveAssignment(filters);
  const officialRecord = getOfficialGradeRecord(filters);
  const localDraft = getGradeDraft(filters);
  const visibleStudents = filters.classId === "CLS-002" ? gradeStudents.slice(0, 1) : gradeStudents;
  const visibleStudentIds = new Set(visibleStudents.map((student) => student.id));
  const storedGrades = officialRecord?.grades || {};
  const baseGrades = Object.fromEntries(
    gradeStudents.map((student) => [
      student.id,
      { ...initialGrades[student.id], ...storedGrades[student.id] },
    ]),
  );
  const grades = Object.fromEntries(
    Object.entries(baseGrades).filter(([studentId]) => visibleStudentIds.has(studentId)),
  );

  return {
    assignment,
    students: visibleStudents,
    grades,
    localDraft,
    status: officialRecord?.status || GRADE_STATUSES.DRAFT,
    savedAt: officialRecord?.savedAt || null,
  };
}

export async function saveGradeDraft(payload) {
  await wait(120);
  resolveAssignment(payload);
  return saveGradeDraftRecord({ ...payload, draftSavedAt: new Date().toISOString() });
}

export async function saveGrades(payload) {
  if (!appConfig.useMockApi) {
    const entries = Object.entries(payload.grades).flatMap(([studentId, scores]) =>
      Object.entries(scores).map(([componentCode, score]) => ({
        studentId,
        componentCode,
        score: score === "" || score === undefined ? null : Number(score),
      })),
    );
    const data = await api.put(`/teacher/classes/${payload.classId}/grades`, { entries });
    return { success: true, savedAt: new Date().toISOString(), data: { ...data, grades: payload.grades, status: GRADE_STATUSES.DRAFT } };
  }
  await wait(800);
  resolveAssignment(payload);
  const record = saveOfficialGradeRecord({
    ...payload,
    status: payload.status || GRADE_STATUSES.DRAFT,
    savedAt: new Date().toISOString(),
    savedBy: teacherUser.id,
  });
  return { success: true, savedAt: record.savedAt, data: record };
}

export async function getLearningTopics(assignmentId) {
  await wait(250);
  const record = getTopicRecord(assignmentId);
  return { ...defaultLearningTopics, ...record?.topics };
}

export async function saveLearningTopics(payload) {
  await wait(650);
  const assignment = resolveAssignment(payload);
  if (assignment.assignmentId !== payload.assignmentId) {
    throw new Error("UNAUTHORIZED_ASSIGNMENT");
  }
  return saveTopicRecord({ ...payload, savedAt: new Date().toISOString(), savedBy: teacherUser.id });
}

export async function getHomeroomSubjectGrades({ academicYear, semester, subjectId }) {
  await wait(500);
  const user = getStoredUser();
  if (!canViewClassSubjectGrades(user)) {
    throw new Error("UNAUTHORIZED_HOMEROOM_ACCESS");
  }

  const subject = homeroomSubjects.find((item) => item.id === subjectId);
  if (!subject || academicYear !== "2026/2027" || normalizeSemester(semester) !== "GANJIL") {
    throw new Error("INVALID_HOMEROOM_GRADE_FILTER");
  }

  return {
    class: { ...user.homeroomClass },
    subject,
    students: user.homeroomClass.id === "CLS-001" ? gradeStudents : [],
    grades: JSON.parse(JSON.stringify(initialGrades)),
    finalGrades: { ...homeroomFinalGrades },
  };
}
