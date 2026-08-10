import test from "node:test";
import assert from "node:assert/strict";
import { assessmentComponents, TOTAL_ASSESSMENT_WEIGHT } from "../src/data/assessmentComponents.js";
import { calculateFinalGrade } from "../src/utils/calculateFinalGrade.js";
import { validateGradeValue } from "../src/utils/gradeValidation.js";
import { MAX_IMPORT_FILE_SIZE, validateImportFile } from "../src/utils/importFile.js";
import { canViewClassSubjectGrades } from "../src/utils/teacherPermissions.js";

test("template nilai mengikuti 8 komponen API dengan total bobot 100%", () => {
  assert.equal(assessmentComponents.length, 8);
  assert.equal(TOTAL_ASSESSMENT_WEIGHT, 100);
});

test("nilai di luar rentang 0 sampai 100 ditolak", () => {
  assert.match(validateGradeValue(-1), /0–100/);
  assert.match(validateGradeValue(101), /0–100/);
  assert.equal(validateGradeValue(0), "");
  assert.equal(validateGradeValue(100), "");
});

test("nilai kosong tetap dianggap belum lengkap, bukan nol", () => {
  const scores = Object.fromEntries(assessmentComponents.map((component) => [component.id, 80]));
  scores.UTS = null;
  assert.equal(calculateFinalGrade(scores, assessmentComponents), null);
});

test("perhitungan nilai akhir menggunakan bobot kontrak", () => {
  const scores = Object.fromEntries(assessmentComponents.map((component) => [component.id, 80]));
  assert.equal(calculateFinalGrade(scores, assessmentComponents), 80);
});

test("unggahan akun dibatasi maksimal 5 MB", () => {
  assert.equal(MAX_IMPORT_FILE_SIZE, 5 * 1024 * 1024);
  assert.match(validateImportFile({ name: "guru.csv", size: MAX_IMPORT_FILE_SIZE + 1 }), /5MB/);
  assert.equal(validateImportFile({ name: "guru.csv", size: MAX_IMPORT_FILE_SIZE }), "");
  assert.match(validateImportFile({ name: "guru.pdf", size: 1000 }), /tidak didukung/);
});

test("hanya teacher dengan assignment wali kelas yang dapat melihat nilai mapel kelas", () => {
  assert.equal(canViewClassSubjectGrades({ role: "teacher", isHomeroomTeacher: false }), false);
  assert.equal(canViewClassSubjectGrades({ role: "teacher", isHomeroomTeacher: true }), false);
  assert.equal(canViewClassSubjectGrades({
    role: "teacher",
    isHomeroomTeacher: true,
    homeroomClass: { id: "CLS-001", name: "X-MIPA 1" },
  }), true);
  assert.equal(canViewClassSubjectGrades({
    role: "student",
    isHomeroomTeacher: true,
    homeroomClass: { id: "CLS-001", name: "X-MIPA 1" },
  }), false);
});
