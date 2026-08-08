import { Keyboard } from "lucide-react";

export default function GradePageHeader({ onInputClick }) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-[26px] font-bold tracking-[-0.035em] text-[#202838]">Input Nilai Siswa</h1>
        <p className="mt-1 max-w-[690px] text-sm leading-6 text-[#64748B]">
          Masukkan nilai tugas, ulangan harian, UTS, dan UAS. Sistem akan otomatis menghitung nilai akhir berdasarkan bobot yang telah ditetapkan.
        </p>
      </div>
      <button
        type="button"
        onClick={onInputClick}
        className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#2F67ED] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1451D2] sm:w-auto"
      >
        <Keyboard aria-hidden="true" className="h-4 w-4" /> Input Nilai
      </button>
    </header>
  );
}
