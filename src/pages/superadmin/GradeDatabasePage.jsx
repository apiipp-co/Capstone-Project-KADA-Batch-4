import { Search } from "lucide-react";
import { useState } from "react";
import GradeDatabaseTable from "../../components/superadmin/GradeDatabaseTable";
import SuperAdminFilterSelect from "../../components/superadmin/SuperAdminFilterSelect";
import { assessmentComponents } from "../../data/assessmentComponents";
import {
  gradeDatabaseRecords,
  gradeDatabaseTotalStudents,
  subjectDatabaseRecords,
} from "../../data/superAdminManagementData";
import { validateGradeValue } from "../../utils/gradeValidation";

const initialFilters = {
  academicYear: "2023/2024",
  semester: "Ganjil",
  className: "X-MIPA-1",
  subjectId: "subject-1",
};

const academicYearOptions = [
  { id: "2023/2024", name: "2023/2024" },
  { id: "2024/2025", name: "2024/2025" },
];
const semesterOptions = [
  { id: "Ganjil", name: "Ganjil" },
  { id: "Genap", name: "Genap" },
];
const classOptions = [{ id: "X-MIPA-1", name: "X-MIPA-1" }];
const subjectOptions = subjectDatabaseRecords.map((subject) => ({
  id: subject.id,
  name: subject.filterName,
}));

export default function GradeDatabasePage() {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(initialFilters.academicYear);
  const [selectedSemester, setSelectedSemester] = useState(initialFilters.semester);
  const [selectedClass, setSelectedClass] = useState(initialFilters.className);
  const [selectedSubject, setSelectedSubject] = useState(initialFilters.subjectId);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [students, setStudents] = useState(gradeDatabaseRecords);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editValues, setEditValues] = useState(null);
  const [editErrors, setEditErrors] = useState({});
  const [page, setPage] = useState(1);
  const [actionMessage, setActionMessage] = useState("");

  const activeSubject = subjectDatabaseRecords.find((subject) => subject.id === appliedFilters.subjectId)
    || subjectDatabaseRecords[0];
  const isLocked = false;
  const matchesPrototypeFilter = Object.entries(initialFilters).every(
    ([key, value]) => appliedFilters[key] === value,
  );
  const totalStudents = matchesPrototypeFilter ? gradeDatabaseTotalStudents : 0;
  const visibleStudents = matchesPrototypeFilter && page === 1 ? students : [];

  const applyFilters = () => {
    setAppliedFilters({
      academicYear: selectedAcademicYear,
      semester: selectedSemester,
      className: selectedClass,
      subjectId: selectedSubject,
    });
    setPage(1);
    setEditingStudentId(null);
    setEditValues(null);
    setEditErrors({});
  };

  const startEditing = (student) => {
    setEditingStudentId(student.id);
    setEditValues(Object.fromEntries(
      assessmentComponents.map((component) => [component.id, student.scores[component.id] ?? ""]),
    ));
    setEditErrors({});
  };

  const changeEditValue = (componentId, value) => {
    setEditValues((current) => ({ ...current, [componentId]: value }));
    setEditErrors((current) => ({ ...current, [componentId]: validateGradeValue(value) }));
  };

  const saveStudentGrades = (student) => {
    const validationErrors = Object.fromEntries(
      assessmentComponents.map((component) => [component.id, validateGradeValue(editValues?.[component.id])]),
    );
    setEditErrors(validationErrors);
    if (Object.values(validationErrors).some(Boolean)) return;

    const nextScores = Object.fromEntries(
      assessmentComponents.map((component) => {
        const value = editValues?.[component.id];
        return [component.id, value === "" || value === null || value === undefined ? null : Number(value)];
      }),
    );
    setStudents((current) => current.map((item) => (
      item.id === student.id ? { ...item, scores: nextScores } : item
    )));
    setEditingStudentId(null);
    setEditValues(null);
    setEditErrors({});
    setActionMessage(`Nilai ${student.name} berhasil diperbarui secara lokal.`);
  };

  const cancelEditing = () => {
    setEditingStudentId(null);
    setEditValues(null);
    setEditErrors({});
    setActionMessage("Perubahan nilai dibatalkan.");
  };

  const changePage = (nextPage) => {
    setPage(nextPage);
    cancelEditing();
  };

  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-bold tracking-[-0.035em] text-[#20232D]">Database Nilai</h1>
        <p className="mt-2 text-sm text-[#555D6E]">
          Akses dan tinjau rincian nilai siswa per periode dan mata pelajaran.
        </p>
      </header>

      <section className="mt-6 rounded-lg border border-[#D7DCE7] bg-white p-4 shadow-[0_1px_3px_rgba(30,42,75,0.04)]" aria-label="Filter database nilai">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_0.9fr_1fr_1fr_auto] lg:items-end">
          <SuperAdminFilterSelect label="TAHUN AJARAN" value={selectedAcademicYear} onChange={(event) => setSelectedAcademicYear(event.target.value)} options={academicYearOptions} />
          <SuperAdminFilterSelect label="SEMESTER" value={selectedSemester} onChange={(event) => setSelectedSemester(event.target.value)} options={semesterOptions} />
          <SuperAdminFilterSelect label="KELAS" value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)} options={classOptions} />
          <SuperAdminFilterSelect label="MAPEL" value={selectedSubject} onChange={(event) => setSelectedSubject(event.target.value)} options={subjectOptions} />
          <button type="button" onClick={applyFilters} aria-label="Cari data nilai" className="flex h-10 w-10 items-center justify-center rounded-md bg-[#0756D9] text-white shadow-[0_3px_8px_rgba(7,86,217,0.2)] hover:bg-[#0648B8]">
            <Search aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </section>

      <GradeDatabaseTable
        records={visibleStudents}
        totalStudents={totalStudents}
        page={page}
        onPageChange={changePage}
        editingStudentId={editingStudentId}
        editValues={editValues}
        editErrors={editErrors}
        onEdit={startEditing}
        onEditValueChange={changeEditValue}
        onSave={saveStudentGrades}
        onCancel={cancelEditing}
        kkm={activeSubject.kkm}
        editable={!isLocked}
        isLocked={isLocked}
      />
      <p aria-live="polite" className="sr-only">{actionMessage}</p>
    </main>
  );
}
