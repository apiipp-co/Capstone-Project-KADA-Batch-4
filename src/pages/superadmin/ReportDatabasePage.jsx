import { ChevronLeft, ChevronRight, Download, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import {
  PromotionStatusBadge,
  ReportAverageBadge,
} from "../../components/superadmin/ReportDatabaseBadges";
import SuperAdminFilterSelect from "../../components/superadmin/SuperAdminFilterSelect";
import Button from "../../components/ui/Button";
import Toast from "../../components/ui/Toast";
import {
  reportDatabaseRecords,
  reportDatabaseTotalStudents,
} from "../../data/superAdminManagementData";
import { triggerCsvDownload } from "../../utils/attendanceExport";

const PAGE_SIZE = 4;
const initialFilters = {
  academicYear: "2023/2024",
  semester: "Ganjil",
  className: "X-MIPA-1",
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
const avatarStyles = {
  blue: "bg-blue-100 text-blue-700",
  orange: "bg-orange-100 text-orange-700",
  slate: "bg-slate-200 text-slate-700",
  red: "bg-red-100 text-red-700",
};

function escapeCsv(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export default function ReportDatabasePage() {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(initialFilters.academicYear);
  const [selectedSemester, setSelectedSemester] = useState(initialFilters.semester);
  const [selectedClass, setSelectedClass] = useState(initialFilters.className);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);

  const matchesPrototypeFilter = Object.entries(initialFilters).every(
    ([key, value]) => appliedFilters[key] === value,
  );
  const totalStudents = matchesPrototypeFilter ? reportDatabaseTotalStudents : 0;
  const pageCount = Math.max(1, Math.ceil(totalStudents / PAGE_SIZE));
  const visibleReports = matchesPrototypeFilter && page === 1 ? reportDatabaseRecords : [];
  const rangeStart = totalStudents === 0 ? 0 : ((page - 1) * PAGE_SIZE) + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, totalStudents);

  const applyFilters = () => {
    setAppliedFilters({
      academicYear: selectedAcademicYear,
      semester: selectedSemester,
      className: selectedClass,
    });
    setPage(1);
  };

  const exportReportList = () => {
    const rows = reportDatabaseRecords.map((report, index) => [
      index + 1,
      report.studentName,
      report.nis,
      report.average.toFixed(1),
      report.status === "promoted" ? "Naik Kelas" : "Tinggal Kelas",
    ]);
    const csv = `\uFEFF${[
      ["No", "Nama Siswa", "NIS", "Rata-rata Nilai", "Status"],
      ...rows,
    ].map((row) => row.map(escapeCsv).join(",")).join("\r\n")}`;
    triggerCsvDownload(csv, "database-rapor-2023-2024.csv");
    setToast({ type: "success", message: "Daftar rapor berhasil diekspor sebagai CSV." });
  };

  const handleDownloadStudentReport = (report) => {
    if (!report.canDownload || report.reportStatus !== "distributed") {
      setToast({ type: "error", message: `Rapor ${report.studentName} belum dapat diunduh.` });
      return;
    }
    setToast({
      type: "success",
      message: `Unduhan rapor ${report.studentName} akan dihubungkan ke layanan rapor sekolah.`,
    });
  };

  return (
    <main className="mx-auto w-full max-w-[1160px] px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-bold tracking-[-0.035em] text-[#20232D]">Database Rapor</h1>
        <p className="mt-2 max-w-[720px] text-sm leading-6 text-[#555D6E]">
          Akses dan tinjau hasil penilaian rapor siswa per periode. Gunakan filter untuk menemukan data spesifik dengan cepat.
        </p>
      </header>

      <section className="mt-6 rounded-lg border border-[#D7DCE7] bg-white p-4 shadow-[0_1px_3px_rgba(30,42,75,0.04)]" aria-label="Filter database rapor">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
          <SuperAdminFilterSelect label="TAHUN AJARAN" value={selectedAcademicYear} onChange={(event) => setSelectedAcademicYear(event.target.value)} options={academicYearOptions} />
          <SuperAdminFilterSelect label="SEMESTER" value={selectedSemester} onChange={(event) => setSelectedSemester(event.target.value)} options={semesterOptions} />
          <SuperAdminFilterSelect label="KELAS" value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)} options={classOptions} />
          <Button onClick={applyFilters} className="h-10 px-6">Tampilkan</Button>
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-lg border border-[#D7DCE7] bg-white shadow-[0_1px_3px_rgba(30,42,75,0.04)]" aria-labelledby="report-data-title">
        <div className="flex items-center justify-between border-b border-[#D7DCE7] px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#E8EFFF] text-[#0756D9]">
              <FileSpreadsheet aria-hidden="true" className="h-4 w-4" />
            </span>
            <h2 id="report-data-title" className="text-sm font-semibold text-[#20232D]">Data Rapor Siswa</h2>
          </div>
          <button type="button" onClick={exportReportList} aria-label="Unduh daftar rapor" title="Unduh daftar rapor" className="rounded-md p-2 text-[#0756D9] hover:bg-[#E8EFFF]">
            <Download aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead className="bg-[#F4F5F7] text-[10px] font-semibold uppercase tracking-wide text-[#555D6E]">
              <tr>
                <th scope="col" className="w-16 px-4 py-4 text-center">No</th>
                <th scope="col" className="w-[260px] px-4 py-4">Nama Siswa</th>
                <th scope="col" className="w-32 px-4 py-4">NIS</th>
                <th scope="col" className="w-40 px-4 py-4 text-center">Rata-rata Nilai</th>
                <th scope="col" className="w-40 px-4 py-4">Status</th>
                <th scope="col" className="w-40 px-4 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7DCE7] text-sm text-[#343946]">
              {visibleReports.map((report, index) => (
                <tr key={report.id} className="hover:bg-[#FAFBFD]">
                  <td className="px-4 py-4 text-center text-[#697184]">{index + 1}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${avatarStyles[report.avatarTone] || avatarStyles.slate}`}>
                        {report.initials}
                      </span>
                      <span className="font-medium text-[#20232D]">{report.studentName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">{report.nis}</td>
                  <td className="px-4 py-4 text-center"><ReportAverageBadge value={report.average} tone={report.averageTone} /></td>
                  <td className="px-4 py-4"><PromotionStatusBadge status={report.status} /></td>
                  <td className="px-4 py-4">
                    <button type="button" onClick={() => handleDownloadStudentReport(report)} disabled={!report.canDownload} className="inline-flex items-center gap-1 text-xs font-semibold uppercase text-[#0756D9] hover:underline disabled:cursor-not-allowed disabled:text-[#8A93A6]">
                      Unduh Rapor <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {visibleReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#697184]">
                    {totalStudents === 0 ? "Tidak ada data rapor untuk filter ini." : "Detail rapor halaman pratinjau ini belum tersedia."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex flex-col gap-3 border-t border-[#D7DCE7] bg-[#FAFBFD] px-4 py-3 text-xs text-[#697184] sm:flex-row sm:items-center sm:justify-between">
          <p>Menampilkan {rangeStart}-{rangeEnd} dari {totalStudents} siswa</p>
          <nav aria-label="Pagination database rapor" className="flex items-center gap-1">
            <button type="button" aria-label="Halaman sebelumnya" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E1E6F0] bg-white disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            {[1, 2, 3].filter((pageNumber) => pageNumber <= pageCount).map((pageNumber) => (
              <button key={pageNumber} type="button" aria-label={`Halaman ${pageNumber}`} aria-current={page === pageNumber ? "page" : undefined} onClick={() => setPage(pageNumber)} className={`h-8 min-w-8 rounded-md border px-2 ${page === pageNumber ? "border-[#0756D9] bg-[#0756D9] text-white" : "border-[#E1E6F0] bg-white text-[#343946]"}`}>
                {pageNumber}
              </button>
            ))}
            <button type="button" aria-label="Halaman berikutnya" disabled={page === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E1E6F0] bg-white disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </nav>
        </footer>
      </section>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </main>
  );
}
