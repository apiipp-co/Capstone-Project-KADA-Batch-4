import { historyByStudent, meetingHistory, students } from "../data/attendanceData";
import { teacherUser } from "../data/teacherData";
import { createAttendanceCsv, triggerCsvDownload } from "../utils/attendanceExport";

const STORAGE_KEY = "edutrack_attendance_records";
const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

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
        savedRecord?.records.find((record) => record.studentId === student.id)?.status || "NOT_RECORDED",
    })),
    savedRecord: savedRecord || null,
  };
}

export async function saveAttendance(payload) {
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
