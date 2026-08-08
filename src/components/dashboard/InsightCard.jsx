import { CalendarDays, ChartNoAxesColumn } from "lucide-react";
import { Link } from "react-router-dom";
import InsightBadge from "./InsightBadge";

export default function InsightCard() {
  return (
    <section className="mt-8 max-w-[720px] rounded-xl bg-white px-5 py-7 shadow-soft sm:px-8">
      <h2 className="text-[18px] font-semibold text-[#6F59F7]">Insight EduTrack Hari Ini</h2>
      <p className="mt-2 text-sm leading-6 text-[#20232D]">
        Terdapat 3 siswa di kelas <InsightBadge>X-MIPA 1</InsightBadge> mendapat nilai di bawah KKM pada Ulangan 2.
        Kehadiran <InsightBadge tone="amber">XI-IPS 1</InsightBadge> minggu ini terpantau turun 15% dari rata-rata.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          to="/teacher/grades"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#7556F4] to-[#3983F8] px-5 text-sm font-semibold text-white shadow-md transition hover:brightness-95"
        >
          <ChartNoAxesColumn aria-hidden="true" className="h-4 w-4" /> Lihat Detail Nilai
        </Link>
        <Link
          to="/teacher/attendance"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-[#6C3BEF] hover:bg-violet-50"
        >
          <CalendarDays aria-hidden="true" className="h-4 w-4" /> Tinjau Presensi
        </Link>
      </div>
    </section>
  );
}
