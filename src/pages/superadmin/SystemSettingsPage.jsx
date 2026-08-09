import { ChevronLeft, ChevronRight, ListFilter } from "lucide-react";
import { useMemo, useState } from "react";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Toast from "../../components/ui/Toast";
import { mockSecurityLogs } from "../../data/superAdminData";
import { cn } from "../../utils/cn";

const PAGE_SIZE = 5;

const SECURITY_RISK = {
  high: {
    label: "Tinggi",
    className: "border-red-200 bg-red-100 text-red-700",
  },
  medium: {
    label: "Sedang",
    className: "border-amber-200 bg-amber-100 text-amber-700",
  },
  low: {
    label: "Rendah",
    className: "border-slate-300 bg-slate-200 text-slate-600",
  },
};

export default function SystemSettingsPage() {
  const [securityLogs, setSecurityLogs] = useState(mockSecurityLogs);
  const [riskFilter, setRiskFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pendingUnblockId, setPendingUnblockId] = useState(null);
  const [toast, setToast] = useState(null);

  const filteredLogs = useMemo(
    () => riskFilter === "all" ? securityLogs : securityLogs.filter((log) => log.risk === riskFilter),
    [riskFilter, securityLogs],
  );
  const pageCount = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const visibleLogs = filteredLogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const firstEntry = filteredLogs.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastEntry = Math.min(page * PAGE_SIZE, filteredLogs.length);

  const changeRiskFilter = (event) => {
    setRiskFilter(event.target.value);
    setPage(1);
  };

  const confirmUnblock = () => {
    if (!pendingUnblockId) return;
    // TODO: replace with unblockSecuritySubject({ logId: pendingUnblockId }).
    setSecurityLogs((current) => current.map((log) => (
      log.id === pendingUnblockId ? { ...log, blocked: false } : log
    )));
    setPendingUnblockId(null);
    setToast({ type: "success", message: "Blokir pengguna berhasil dibuka pada mode frontend." });
  };

  return (
    <div className="px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1000px]">
        <header>
          <h1 className="text-[26px] font-bold tracking-[-0.035em] text-[#20232D]">Pengaturan Sistem</h1>
          <p className="mt-1 text-sm text-[#555D6E]">Monitor dan atur aktivitas sistem sekolah</p>
        </header>

        <section className="mt-8 overflow-hidden rounded-xl border border-[#C5CDDC] bg-white" aria-labelledby="security-log-title">
          <div className="flex flex-col gap-3 border-b border-[#D7DCE7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="security-log-title" className="text-sm font-medium text-[#20232D]">Log Peringatan Keamanan</h2>
            <label className="relative block w-full sm:w-[210px]">
              <span className="sr-only">Filter tingkat risiko</span>
              <ListFilter aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#697184]" />
              <select
                value={riskFilter}
                onChange={changeRiskFilter}
                aria-label="Filter tingkat risiko"
                className="h-10 w-full appearance-none rounded-md border border-[#C5CDDC] bg-white pl-10 pr-3 text-sm text-[#343946] outline-none transition focus:border-[#0756D9] focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Semua Tingkat Risiko</option>
                <option value="high">Tinggi</option>
                <option value="medium">Sedang</option>
                <option value="low">Rendah</option>
              </select>
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead className="bg-[#F3F4F7] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#697184]">
                <tr>
                  <th scope="col" className="w-[165px] px-5 py-3">Stempel<br />Waktu</th>
                  <th scope="col" className="w-[190px] px-4 py-3">Pengguna / IP</th>
                  <th scope="col" className="px-4 py-3">Aksi Terdeteksi</th>
                  <th scope="col" className="w-[145px] px-4 py-3">Tingkat<br />Risiko</th>
                  <th scope="col" className="w-[190px] px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D7DCE7] text-sm text-[#20232D]">
                {visibleLogs.map((log) => {
                  const risk = SECURITY_RISK[log.risk];
                  return (
                    <tr key={log.id} className={cn(log.blocked && "bg-red-50/70")}>
                      <td className="px-5 py-4 align-top">
                        <p>{log.date}</p>
                        <p className="mt-1 text-xs text-[#555D6E]">{log.time}</p>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={cn(log.blocked && "line-through text-[#697184]")}>{log.user}</span>
                          {log.userType && <span className="rounded-sm bg-slate-200 px-1.5 py-0.5 text-[10px] text-slate-600">{log.userType}</span>}
                        </div>
                        <p className="mt-1 font-mono text-xs text-[#555D6E]">{log.ip}</p>
                      </td>
                      <td className="px-4 py-4 align-top leading-5">
                        {log.action.map((line, index) => <p key={`${log.id}-action-${index}`} className={index ? "text-[#555D6E]" : undefined}>{line}</p>)}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <Badge className={cn("border px-2 py-1 font-medium", risk.className)}><span aria-hidden="true">●</span>{risk.label}</Badge>
                      </td>
                      <td className="px-4 py-4 align-top">
                        {log.blocked && (
                          <div className="flex items-center justify-center gap-3">
                            <span className="text-xs font-medium text-red-600">Diblokir</span>
                            <Button variant="secondary" onClick={() => setPendingUnblockId(log.id)} className="h-9 rounded-md border-emerald-500 px-3 text-xs text-emerald-600 hover:bg-emerald-50">Buka Blokir</Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#D7DCE7] px-5 py-3 text-xs text-[#555D6E] sm:flex-row sm:items-center sm:justify-between">
            <p>Menampilkan {firstEntry} sampai {lastEntry} dari {filteredLogs.length} entri</p>
            <div className="flex items-center gap-1">
              <button type="button" aria-label="Halaman sebelumnya" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded p-2 hover:bg-slate-100 disabled:opacity-35"><ChevronLeft aria-hidden="true" className="h-4 w-4" /></button>
              {Array.from({ length: Math.min(pageCount, 3) }, (_, index) => index + 1).map((pageNumber) => (
                <button key={pageNumber} type="button" aria-label={`Halaman ${pageNumber}`} aria-current={page === pageNumber ? "page" : undefined} onClick={() => setPage(pageNumber)} className={cn("h-8 min-w-8 rounded px-2", page === pageNumber ? "bg-[#0756D9] text-white" : "hover:bg-slate-100")}>{pageNumber}</button>
              ))}
              {pageCount > 3 && <span className="px-1">...</span>}
              <button type="button" aria-label="Halaman berikutnya" disabled={page === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="rounded p-2 hover:bg-slate-100 disabled:opacity-35"><ChevronRight aria-hidden="true" className="h-4 w-4" /></button>
            </div>
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={Boolean(pendingUnblockId)}
        onClose={() => setPendingUnblockId(null)}
        onConfirm={confirmUnblock}
        title="Buka Blokir Pengguna?"
        description="Pengguna akan diizinkan kembali mengakses sistem. Pastikan aktivitas telah ditinjau sebelum melanjutkan."
        confirmLabel="Buka Blokir"
        confirmVariant="success"
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
