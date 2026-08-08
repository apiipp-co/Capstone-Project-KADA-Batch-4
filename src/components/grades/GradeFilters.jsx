import { Search } from "lucide-react";
import { teacherUser } from "../../data/teacherData";
import Select from "../ui/Select";

function FilterField({ label, children }) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 px-1 text-xs font-medium text-[#4B5060]">{label}</p>
      {children}
    </div>
  );
}

export default function GradeFilters({ filters, onChange, onShow, loading }) {
  const selectedAssignment = teacherUser.assignedClasses.find((item) => item.id === filters.classId);
  const keepAssignedOption = () => {};

  const changeClass = (event) => {
    const assignment = teacherUser.assignedClasses.find((item) => item.id === event.target.value);
    onChange({
      classId: assignment.id,
      subjectId: assignment.subjectId,
      academicYear: assignment.academicYear,
      semester: assignment.semester.toUpperCase(),
    });
  };

  return (
    <section className="mt-8 rounded-[14px] border border-[#E4E8F1] bg-white p-4 shadow-[0_2px_5px_rgba(30,42,75,0.04)]">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[130px_160px_1fr_140px_auto] lg:items-end">
        <FilterField label="Tahun Ajaran">
          <Select label="Tahun Ajaran" value={filters.academicYear} onChange={keepAssignedOption} disabled={loading}>
            <option value="2026/2027">2026/2027</option>
          </Select>
        </FilterField>
        <FilterField label="Semester">
          <Select label="Semester" value={filters.semester} onChange={keepAssignedOption} disabled={loading}>
            <option value="GANJIL">Semester Ganjil</option>
          </Select>
        </FilterField>
        <FilterField label="Pilih Mata Pelajaran">
          <Select label="Pilih Mata Pelajaran" value={filters.subjectId} onChange={keepAssignedOption} disabled={loading}>
            <option value={selectedAssignment.subjectId}>{selectedAssignment.subjectName}</option>
          </Select>
        </FilterField>
        <FilterField label="Pilih Kelas">
          <Select
            label="Pilih Kelas"
            value={filters.classId}
            onChange={changeClass}
            disabled={loading}
            className="[&_select]:border-blue-200 [&_select]:bg-blue-50 [&_select]:font-semibold [&_select]:text-[#0756D9]"
          >
            {teacherUser.assignedClasses.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </Select>
        </FilterField>
        <button
          type="button"
          onClick={onShow}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#2F67ED] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1451D2] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 lg:col-span-1"
        >
          <Search aria-hidden="true" className="h-4 w-4" /> Tampilkan
        </button>
      </div>
    </section>
  );
}
