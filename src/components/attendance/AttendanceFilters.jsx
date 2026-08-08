import { Download, Search } from "lucide-react";
import { teacherUser } from "../../data/teacherData";
import DatePicker from "../ui/DatePicker";
import Select from "../ui/Select";

export default function AttendanceFilters({ filters, onChange, onSearch, onDownload, loaded, loading }) {
  const selectedAssignment = teacherUser.assignedClasses.find((item) => item.id === filters.classId);

  const changeClass = (event) => {
    const assignment = teacherUser.assignedClasses.find((item) => item.id === event.target.value);
    onChange({ ...filters, classId: assignment.id, subjectId: assignment.subjectId });
  };

  return (
    <section className="border-b border-[#E5E8F0] bg-white px-4 py-4 sm:px-6">
      <div className="ml-auto grid max-w-[690px] grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-center lg:justify-end">
        <Select label="Kelas" value={filters.classId} onChange={changeClass} disabled={loading} className="lg:w-[116px]">
          {teacherUser.assignedClasses.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </Select>
        <Select
          label="Mata pelajaran"
          value={filters.subjectId}
          onChange={(event) => onChange({ ...filters, subjectId: event.target.value })}
          disabled={loading}
          className="lg:w-[174px]"
        >
          <option value={selectedAssignment.subjectId}>{selectedAssignment.subjectName}</option>
        </Select>
        <DatePicker
          value={filters.date}
          onChange={(event) => onChange({ ...filters, date: event.target.value })}
          disabled={loading}
        />
        <button
          type="button"
          onClick={onSearch}
          disabled={loading}
          aria-label="Tampilkan presensi"
          className="flex h-10 items-center justify-center rounded-lg bg-[#0756D9] px-3 text-white shadow-sm transition hover:bg-[#0648B8] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-1 lg:w-10 lg:px-0"
        >
          <Search aria-hidden="true" className="h-5 w-5" />
          <span className="ml-2 text-sm font-semibold lg:sr-only">Tampilkan</span>
        </button>
        <button
          type="button"
          onClick={onDownload}
          disabled={!loaded || loading}
          className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#0756D9] bg-white px-4 text-sm font-semibold text-[#0756D9] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400 disabled:hover:bg-white sm:col-span-2 lg:col-span-1"
        >
          <Download aria-hidden="true" className="h-4 w-4" /> Download Rekap
        </button>
      </div>
    </section>
  );
}
