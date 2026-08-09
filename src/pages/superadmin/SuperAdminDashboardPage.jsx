import { ChevronDown, ChevronUp, ClipboardCheck, Sigma, UserRoundPlus } from "lucide-react";
import { useState } from "react";

const tutorials = [
  {
    id: "accounts",
    title: "Pembuatan Akun",
    icon: UserRoundPlus,
    contentTitle: "Panduan Membuat Akun Massal via Excel",
    steps: [
      "Siapkan file Excel dengan format yang telah disediakan (template dapat diunduh di menu Pembuatan Akun).",
      "Pastikan kolom Nama, Email, NIP terisi dengan benar.",
      "Navigasi ke menu Pembuatan Akun > Akun Guru atau Akun Siswa, upload file Excel.",
      "Pilih file yang telah disiapkan dan tunggu proses sinkronisasi selesai.",
      "Username akan tampil dan silakan buat akun secara bulk untuk guru/siswa. Password akan terbuat secara otomatis.",
    ],
  },
  {
    id: "assignments",
    title: "Penugasan Guru & Siswa",
    icon: ClipboardCheck,
    contentTitle: "Panduan Mengatur Kelas dan Wali Kelas",
    steps: [
      "Masuk ke menu Penugasan dan pilih tingkat kelas (Kelas X, XI, atau XII).",
      "Untuk memasukkan siswa ke dalam kelas, klik Kelola Siswa, lalu centang nama-nama siswa yang akan dimasukkan ke kelas.",
      "Untuk menetapkan Wali Kelas, pilih nama guru dari dropdown.",
      "Pastikan jumlah siswa tidak melebihi kapasitas kelas yang telah ditetapkan. Simpan perubahan.",
    ],
  },
  {
    id: "formulas",
    title: "Pengisian Rumus Nilai",
    icon: Sigma,
    contentTitle: "Panduan Konfigurasi Formula Penilaian",
    introduction: "Rumus nilai digunakan untuk menghitung nilai akhir siswa secara otomatis berdasarkan bobot yang ditentukan.",
    steps: [
      "Buka menu Rumus Nilai > Rumus Utama.",
      "Tentukan persentase bobot untuk Tugas, UTS, dan UAS (misal: Tugas 20%, UTS 30%, UAS 50%).",
      "Pastikan total keseluruhan bobot adalah 100%. Simpan formula menggunakan tanda centang pada masing-masing bobot.",
    ],
    note: "Perubahan pada rumus akan otomatis menghitung ulang nilai akhir pada Database Rapor untuk periode aktif.",
  },
];

const initialOpenTutorials = Object.fromEntries(tutorials.map((tutorial) => [tutorial.id, true]));

export default function SuperAdminDashboardPage() {
  const [openTutorials, setOpenTutorials] = useState(initialOpenTutorials);

  const toggleTutorial = (tutorialId) => {
    setOpenTutorials((current) => ({ ...current, [tutorialId]: !current[tutorialId] }));
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1000px]">
        <header>
          <h1 className="text-[27px] font-bold tracking-[-0.035em] text-[#20232D]">Selamat datang, Admin!</h1>
          <p className="mt-2 text-sm text-[#555D6E]">Simak panduan lengkap penggunaan sistem EduTrack untuk administrator.</p>
        </header>

        <section className="mt-8 overflow-hidden rounded-lg border border-[#BAC3D4] bg-white">
          <h2 className="border-b border-[#BAC3D4] bg-[#F0F1F3] px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#303744]">Daftar Tutorial</h2>
          <div className="space-y-3 p-5">
            {tutorials.map((tutorial) => {
              const Icon = tutorial.icon;
              const expanded = openTutorials[tutorial.id];
              const Chevron = expanded ? ChevronUp : ChevronDown;
              return (
                <article key={tutorial.id} className="overflow-hidden rounded border border-[#C5CDDC] bg-white">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`tutorial-${tutorial.id}`}
                    onClick={() => toggleTutorial(tutorial.id)}
                    className="flex min-h-14 w-full items-center gap-3 px-5 py-3 text-left hover:bg-[#FAFBFD]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DFE8FF] text-[#0756D9]"><Icon aria-hidden="true" className="h-5 w-5" /></span>
                    <span className="font-medium text-[#303744]">{tutorial.title}</span>
                    <Chevron aria-hidden="true" className="ml-auto h-4 w-4 text-[#303744]" />
                  </button>
                  {expanded && (
                    <div id={`tutorial-${tutorial.id}`} className="border-t border-[#C5CDDC] px-5 py-4 text-[12px] leading-5 text-[#555D6E] sm:px-6">
                      <h3 className="font-medium text-[#0756D9]">{tutorial.contentTitle}</h3>
                      {tutorial.introduction && <p className="mt-2">{tutorial.introduction}</p>}
                      <ol className="mt-2 list-decimal space-y-1 pl-6 sm:pl-8">
                        {tutorial.steps.map((step) => <li key={step} className="pl-1">{step}</li>)}
                      </ol>
                      {tutorial.note && (
                        <p className="mt-3 border border-[#C8CEDA] border-l-[3px] border-l-[#F59E0B] bg-[#F5F6F8] px-3 py-2 text-[10px] leading-4 text-[#303744]">
                          <strong>Catatan:</strong> {tutorial.note}
                        </p>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
