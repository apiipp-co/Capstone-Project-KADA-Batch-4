import { historyByStudent, meetingHistory, students } from "../data/attendanceData";
import { teacherUser } from "../data/teacherData";
import { createAttendanceCsv, triggerCsvDownload } from "../utils/attendanceExport";
import { appConfig } from "../config/env";
import { api } from "./apiClient";

const STORAGE_KEY = "edutrack_attendance_records";
const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));
const apiToUiStatus = { Hadir: "PRESENT", Izin: "PERMITTED", Sakit: "SICK", Alpa: "ABSENT" };
const uiToApiStatus = { PRESENT: "Hadir", PERMITTED: "Izin", SICK: "Sakit", ABSENT: "Alpa" };

function readRecords() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function assertAssignment({ classId, subjectId }) {
  const assigned = teacherUser.assignedClasses.some(
    (item) => item.id === classId && item.subjectId === subjectId,
  );
  if (!assigned) throw new Error("UNAUTHORIZED_ASSIGNMENT");
}

export async function getAttendance(filters) {
  if (!appConfig.useMockApi) {
    const [sessionsData, studentsData] = await Promise.all([
      api.get(`/teacher/classes/${filters.classId}/attendance-sessions`),
      api.get(`/teacher/classes/${filters.classId}/students`),
    ]);
    const sessions = sessionsData.items || sessionsData || [];
    const classStudents = studentsData.items || studentsData.students || studentsData || [];
    const selectedSession = sessions.find((session) => session.date === filters.date);
    const detail = selectedSession ? await api.get(`/teacher/attendance-sessions/${selectedSession.id || selectedSession.sessionId}`) : null;
    const records = detail?.students || detail?.records || [];
    return {
      meetingNumber: sessions.length + (selectedSession ? 0 : 1),
      meetings: sessions.map((session, index) => ({ number: index + 1, date: session.date })),
      students: classStudents.map((student) => {
        const record = records.find((item) => (item.studentId || item.id) === student.id);
        return { ...student, history: [], currentStatus: apiToUiStatus[record?.status] || "ABSENT" };
      }),
      savedRecord: selectedSession ? { ...selectedSession, sessionId: selectedSession.id || selectedSession.sessionId } : null,
    };
  }
  await wait(700);
  assertAssignment(filters);
  const savedRecord = readRecords().find(
    (item) =>
      item.classId === filters.classId &&
      item.subjectId === filters.subjectId &&
      item.date === filters.date &&
      item.meetingNumber === 4,
  );

  return {
    meetingNumber: 4,
    meetings: meetingHistory,
    students: students.map((student) => ({
      ...student,
      history: historyByStudent[student.id],
      currentStatus:
        savedRecord?.records.find((record) => record.studentId === student.id)?.status || "ABSENT",
    })),
    savedRecord: savedRecord || null,
  };
}

export async function saveAttendance(payload) {
  if (!appConfig.useMockApi) {
    const session = await api.post(`/teacher/classes/${payload.classId}/attendance-sessions`, { date: payload.date });
    const sessionId = session.sessionId || session.id;
    await api.put(`/teacher/attendance-sessions/${sessionId}/records`, {
      records: payload.records.map((record) => ({ studentId: record.studentId, status: uiToApiStatus[record.status] })),
    });
    return { ...payload, sessionId };
  }
  await wait(800);
  assertAssignment(payload);
  const records = readRecords().filter(
    (item) =>
      !(
        item.classId === payload.classId &&
        item.subjectId === payload.subjectId &&
        item.date === payload.date &&
        item.meetingNumber === payload.meetingNumber
      ),
  );
  records.push(payload);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  return payload;
}

export async function updateAttendance(payload) {
  if (!appConfig.useMockApi) {
    if (!payload.sessionId) throw new Error("ATTENDANCE_SESSION_NOT_FOUND");
    await api.put(`/teacher/attendance-sessions/${payload.sessionId}/records`, {
      records: payload.records.map((record) => ({ studentId: record.studentId, status: uiToApiStatus[record.status] })),
    });
    return payload;
  }
  await wait(800);
  assertAssignment(payload);
  const records = readRecords();
  const index = records.findIndex(
    (item) =>
      item.classId === payload.classId &&
      item.subjectId === payload.subjectId &&
      item.date === payload.date &&
      item.meetingNumber === payload.meetingNumber,
  );
  if (index < 0) throw new Error("ATTENDANCE_NOT_FOUND");
  records[index] = payload;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  return payload;
}

export function downloadAttendanceCsv(rows, fileName) {
  triggerCsvDownload(createAttendanceCsv(rows), fileName);
}
