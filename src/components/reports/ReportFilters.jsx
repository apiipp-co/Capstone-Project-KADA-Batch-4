import { Search } from "lucide-react";
import { teacherUser } from "../../data/teacherData";
import Select from "../ui/Select";

export default function ReportFilters({ filters, onChange, onShow, loading }) {
  const selected = teacherUser.assignedClasses.find((item) => item.id === filters.classId);
  const changeClass = (event) => {
    const assignment = teacherUser.assignedClasses.find((item) => item.id === event.target.value);
    onChange({
      classId: assignment.id,
      subjectId: assignment.subjectId,
      academicYear: assignment.academicYear,
      semester: assignment.semester.toUpperCase(),
    });
  };
  const keepAssignedOption = () => {};

  return (
    <section aria-label="Filter rapor" className="mt-7 rounded-[14px] border border-[#E4E8F1] bg-white p-4 shadow-[0_2px_8px_rgba(30,42,75,0.05)]">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.1fr_1.2fr_1.2fr_1fr_auto] lg:items-end">
        <Select label="Kelas" value={filters.classId} onChange={changeClass} disabled={loading}>
          {teacherUser.assignedClasses.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </Select>
        <Select label="Mata Pelajaran" value={filters.subjectId} onChange={keepAssignedOption} disabled={loading}>
          <option value={selected.subjectId}>{selected.subjectName}</option>
        </Select>
        <Select label="Semester" value={filters.semester} onChange={keepAssignedOption} disabled={loading}>
          <option value="GANJIL">Semester Ganjil</option>
        </Select>
        <Select label="Tahun Ajaran" value={filters.academicYear} onChange={keepAssignedOption} disabled={loading}>
          <option value="2026/2027">2026/2027</option>
        </Select>
        <button
          type="button"
          aria-label="Tampilkan daftar rapor"
          title="Tampilkan daftar rapor"
          onClick={onShow}
          disabled={loading}
          className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#0756D9] text-white shadow-sm transition hover:bg-[#0648B8] disabled:opacity-60 lg:w-10"
        >
          <Search aria-hidden="true" className="h-5 w-5" />
          <span className="ml-2 lg:sr-only">Tampilkan daftar rapor</span>
        </button>
      </div>
    </section>
  );
}

