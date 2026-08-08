import {
  defaultLearningTopics,
  GRADE_STATUSES,
  gradeStudents,
  initialGrades,
} from "../data/gradeData";
import { teacherUser } from "../data/teacherData";
import {
  getGradeDraft,
  getOfficialGradeRecord,
  getTopicRecord,
  saveGradeDraftRecord,
  saveOfficialGradeRecord,
  saveTopicRecord,
} from "../stores/gradeStore";

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
  await wait(650);
  const assignment = resolveAssignment(filters);
  const officialRecord = getOfficialGradeRecord(filters);
  const localDraft = getGradeDraft(filters);
  const visibleStudents = filters.classId === "CLS-002" ? gradeStudents.slice(0, 1) : gradeStudents;
  const visibleStudentIds = new Set(visibleStudents.map((student) => student.id));
  const baseGrades = officialRecord?.grades || initialGrades;
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
  return record?.topics || defaultLearningTopics;
}

export async function saveLearningTopics(payload) {
  await wait(650);
  const assignment = resolveAssignment(payload);
  if (assignment.assignmentId !== payload.assignmentId) {
    throw new Error("UNAUTHORIZED_ASSIGNMENT");
  }
  return saveTopicRecord({ ...payload, savedAt: new Date().toISOString(), savedBy: teacherUser.id });
}
