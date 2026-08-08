import { academicPeriod } from "../../data/academicData";
import { teacherUser } from "../../data/teacherData";
import { formatLongDate, getGreeting } from "../../utils/dateFormatter";

export default function DashboardGreeting() {
  const now = new Date();
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[26px] font-bold tracking-[-0.04em] text-[#20232D]">
          {getGreeting(now)}, {teacherUser.displayName} <span aria-label="kopi" role="img">☕</span>
        </h1>
        <p className="mt-1 text-sm text-[#545968]">Ringkasan harian aktivitas dan progres kelas Anda.</p>
      </div>
      <div className="text-left sm:text-right">
        <p className="text-sm font-semibold text-[#20232D]">{formatLongDate(now)}</p>
        <p className="mt-0.5 text-xs text-[#545968]">
          Minggu ke-{academicPeriod.week} Semester {academicPeriod.semester} {academicPeriod.academicYear}
        </p>
      </div>
    </header>
  );
}
