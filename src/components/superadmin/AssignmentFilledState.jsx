import {
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Button from "../ui/Button";
import SuperAdminFilterSelect from "./SuperAdminFilterSelect";
import {
  assignmentAcademicYearOptions,
  assignmentSemesterOptions,
  assignmentTeachers,
  classXStudentPreview,
  classXStudentTotal,
} from "../../data/assignmentWizardData";

const PAGE_SIZE = 4;

function getPaginationPages(currentPage, pageCount) {
  if (pageCount <= 3) return Array.from({ length: pageCount }, (_, index) => index + 1);
  if (currentPage <= 2) return [1, 2, 3];
  if (currentPage >= pageCount - 1) return [pageCount - 2, pageCount - 1, pageCount];
  return [currentPage - 1, currentPage, currentPage + 1];
}

export default function AssignmentFilledState({ gradeLevel, assignments, onStartNew }) {
  const latestAssignment = assignments[assignments.length - 1];
  const latestClass = latestAssignment?.classes?.[0];
  const defaultSemester = latestAssignment?.period?.semester || "Ganjil";
  const defaultAcademicYear = latestAssignment?.period?.academicYear || "2023/2024";
  const defaultClass = latestClass?.shortName || latestClass?.name?.replace(/^Kelas\s+/, "") || "X-MIPA-1";

  const [selectedSemester, setSelectedSemester] = useState(defaultSemester);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(defaultAcademicYear);
  const [selectedClass, setSelectedClass] = useState(defaultClass);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentPage, setStudentPage] = useState(1);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    setSelectedSemester(defaultSemester);
    setSelectedAcademicYear(defaultAcademicYear);
    setSelectedClass(defaultClass);
    setStudentPage(1);
  }, [defaultAcademicYear, defaultClass, defaultSemester, latestAssignment?.id]);

  const homeroomTeacher = assignmentTeachers.find(
    (teacher) => teacher.id === latestClass?.homeroomTeacherId,
  ) || assignmentTeachers[0];

  const filteredStudents = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();
    if (!query) return classXStudentPreview;
    return classXStudentPreview.filter((student) => (
      student.name.toLowerCase().includes(query) || student.nis.includes(query)
    ));
  }, [studentSearch]);

  const totalStudents = studentSearch.trim() ? filteredStudents.length : classXStudentTotal;
  const pageCount = Math.max(1, Math.ceil(totalStudents / PAGE_SIZE));
  const visibleStudents = studentPage === 1 ? filteredStudents.slice(0, PAGE_SIZE) : [];
  const paginationPages = getPaginationPages(studentPage, pageCount);
  const rangeStart = totalStudents === 0 ? 0 : ((studentPage - 1) * PAGE_SIZE) + 1;
  const rangeEnd = Math.min(studentPage * PAGE_SIZE, totalStudents);
  const classOptions = Array.from(new Set(assignments.flatMap((assignment) => (
    assignment.classes?.map((classItem) => classItem.shortName || classItem.name.replace(/^Kelas\s+/, "")) || []
  )))).map((className) => ({ id: className, name: className }));

  const showAssignment = () => {
    setStudentPage(1);
    setActionMessage(`Menampilkan ${selectedSemester} ${selectedAcademicYear}, kelas ${selectedClass}.`);
  };

  return (
    <section className="mx-auto w-full max-w-[1120px] px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-[#20232D]">Penugasan Guru &amp; Siswa Kelas {gradeLevel}</h1>
        <Button
          variant="secondary"
          onClick={onStartNew}
          className="h-10 self-start border-[#0756D9] px-4 text-[#0756D9] shadow-none"
        >
          <Plus aria-hidden="true" className="h-4 w-4" /> Mulai Penugasan Baru
        </Button>
      </header>

      <div className="mt-5 grid gap-4 rounded-lg border border-[#D7DCE7] bg-white p-4 shadow-[0_1px_3px_rgba(30,42,75,0.04)] lg:grid-cols-[minmax(0,1fr)_255px] lg:items-end">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1.1fr_1.15fr_auto] lg:items-end">
          <SuperAdminFilterSelect label="Semester" value={selectedSemester} onChange={(event) => setSelectedSemester(event.target.value)} options={assignmentSemesterOptions} />
          <SuperAdminFilterSelect label="Tahun Ajaran" value={selectedAcademicYear} onChange={(event) => setSelectedAcademicYear(event.target.value)} options={assignmentAcademicYearOptions} />
          <SuperAdminFilterSelect label="Kelas" value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)} options={classOptions.length ? classOptions : [{ id: defaultClass, name: defaultClass }]} />
          <Button onClick={showAssignment} className="h-10 px-5">Tampilkan</Button>
        </div>

        <div className="flex min-h-[66px] items-center gap-3 rounded-md border border-[#E1E6F0] bg-[#F7F9FC] px-4 py-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8EFFF] text-[#0756D9]">
            <ClipboardCheck aria-hidden="true" className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#697184]">Wali Kelas</p>
            <p className="mt-0.5 truncate text-sm font-medium text-[#20232D]">{homeroomTeacher.name}</p>
            <p className="mt-0.5 truncate text-[11px] text-[#697184]">NIP: {homeroomTeacher.nip}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-[#D7DCE7] bg-white shadow-[0_1px_3px_rgba(30,42,75,0.04)]">
        <div className="flex flex-col gap-3 border-b border-[#D7DCE7] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold text-[#20232D]">Daftar Siswa</h2>
          <label className="relative block w-full sm:w-[260px]">
            <span className="sr-only">Cari siswa</span>
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A93A6]" />
            <input
              type="search"
              value={studentSearch}
              onChange={(event) => {
                setStudentSearch(event.target.value);
                setStudentPage(1);
              }}
              placeholder="Cari siswa..."
              className="h-10 w-full rounded-md border border-[#D7DCE7] bg-white pl-9 pr-3 text-sm text-[#343946] outline-none placeholder:text-[#A4AABC] focus:border-[#0756D9] focus:ring-2 focus:ring-[#DCE8FF]"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead className="bg-[#F7F8FA] text-[10px] font-semibold uppercase tracking-wide text-[#555D6E]">
              <tr>
                <th scope="col" className="w-20 px-4 py-3 text-center">No</th>
                <th scope="col" className="w-32 px-4 py-3">NIS</th>
                <th scope="col" className="px-4 py-3">Nama Siswa</th>
                <th scope="col" className="w-36 px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E9F0] text-sm text-[#20232D]">
              {visibleStudents.map((student, index) => (
                <tr key={student.id} className="hover:bg-[#FAFBFD]">
                  <td className="px-4 py-4 text-center text-[#697184]">{index + 1}</td>
                  <td className="px-4 py-4">{student.nis}</td>
                  <td className="px-4 py-4 font-medium">{student.name}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button type="button" aria-label={`Edit ${student.name}`} onClick={() => setActionMessage(`Edit ${student.name} menunggu prototype lanjutan.`)} className="rounded-md p-2 text-[#596174] hover:bg-[#EEF3FC] hover:text-[#0756D9]">
                        <Pencil aria-hidden="true" className="h-4 w-4" />
                      </button>
                      <button type="button" aria-label={`Hapus ${student.name}`} onClick={() => setActionMessage(`Hapus ${student.name} menunggu prototype lanjutan.`)} className="rounded-md p-2 text-[#596174] hover:bg-red-50 hover:text-red-600">
                        <Trash2 aria-hidden="true" className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-[#697184]">
                    {studentSearch ? "Siswa tidak ditemukan." : "Detail siswa untuk halaman pratinjau ini belum tersedia."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#D7DCE7] bg-[#FAFBFD] px-4 py-3 text-xs text-[#697184] sm:flex-row sm:items-center sm:justify-between">
          <p>Menampilkan {rangeStart}-{rangeEnd} dari {totalStudents} siswa</p>
          <nav aria-label="Pagination daftar siswa" className="flex items-center gap-1">
            <button type="button" aria-label="Halaman sebelumnya" disabled={studentPage === 1} onClick={() => setStudentPage((current) => Math.max(1, current - 1))} className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E1E6F0] bg-white hover:bg-[#F0F4FC] disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            {paginationPages.map((page) => (
              <button key={page} type="button" aria-label={`Halaman ${page}`} aria-current={studentPage === page ? "page" : undefined} onClick={() => setStudentPage(page)} className={`h-8 min-w-8 rounded-md border px-2 ${studentPage === page ? "border-[#0756D9] bg-[#0756D9] text-white" : "border-[#E1E6F0] bg-white text-[#343946] hover:bg-[#F0F4FC]"}`}>
                {page}
              </button>
            ))}
            <button type="button" aria-label="Halaman berikutnya" disabled={studentPage === pageCount} onClick={() => setStudentPage((current) => Math.min(pageCount, current + 1))} className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E1E6F0] bg-white hover:bg-[#F0F4FC] disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </nav>
        </div>
        <p aria-live="polite" className="sr-only">{actionMessage}</p>
      </div>
    </section>
  );
}
