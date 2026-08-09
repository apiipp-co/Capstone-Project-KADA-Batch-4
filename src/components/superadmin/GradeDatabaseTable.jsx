import { Check, ChevronLeft, ChevronRight, SquarePen, X } from "lucide-react";
import { assessmentComponents } from "../../data/assessmentComponents";
import InlineScoreInput from "./InlineScoreInput";

const PAGE_SIZE = 6;

export default function GradeDatabaseTable({
  records,
  totalStudents,
  page,
  onPageChange,
  editingStudentId,
  editValues,
  editErrors,
  onEdit,
  onEditValueChange,
  onSave,
  onCancel,
  kkm,
  editable = true,
  isLocked = false,
}) {
  const pageCount = Math.max(1, Math.ceil(totalStudents / PAGE_SIZE));
  const rangeStart = totalStudents === 0 ? 0 : ((page - 1) * PAGE_SIZE) + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, totalStudents);
  const canEdit = editable && !isLocked;

  return (
    <section className="mt-5 overflow-hidden rounded-lg border border-[#D7DCE7] bg-white shadow-[0_1px_3px_rgba(30,42,75,0.04)]" aria-labelledby="grade-data-title">
      <div className="border-b border-[#D7DCE7] px-4 py-4">
        <h2 id="grade-data-title" className="text-sm font-semibold text-[#20232D]">Data Nilai Siswa</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px] border-collapse text-left">
          <thead className="bg-[#F4F5F7] text-[10px] font-semibold uppercase tracking-wide text-[#555D6E]">
            <tr>
              <th scope="col" className="w-14 px-3 py-4 text-center">No</th>
              <th scope="col" className="w-[190px] px-3 py-4">Nama Siswa</th>
              <th scope="col" className="w-28 px-3 py-4">NIS</th>
              {assessmentComponents.map((component) => (
                <th key={component.id} scope="col" className="w-16 px-1.5 py-4 text-center">{component.label}</th>
              ))}
              <th scope="col" className="w-24 px-3 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D7DCE7] text-sm text-[#343946]">
            {records.map((student, index) => {
              const isEditing = editingStudentId === student.id;
              return (
                <tr key={student.id} className={isEditing ? "bg-[#EDF5FF]" : "hover:bg-[#FAFBFD]"}>
                  <td className="px-3 py-3 text-center text-[#697184]">{((page - 1) * PAGE_SIZE) + index + 1}</td>
                  <td className={`px-3 py-3 font-medium ${isEditing ? "text-[#0756D9]" : "text-[#20232D]"}`}>
                    {student.name}{isEditing && " (Editing)"}
                  </td>
                  <td className={`px-3 py-3 ${isEditing ? "text-[#3D78D8]" : ""}`}>{student.nis}</td>
                  {assessmentComponents.map((component, componentIndex) => {
                    const value = isEditing ? editValues?.[component.id] : student.scores[component.id];
                    const error = isEditing ? editErrors?.[component.id] : "";
                    const isBelowKkm = value !== "" && value !== null && value !== undefined && Number(value) < kkm;
                    return (
                      <td key={component.id} className="px-1.5 py-3 text-center align-top">
                        {isEditing ? (
                          <InlineScoreInput
                            compact
                            value={value}
                            onChange={(nextValue) => onEditValueChange(component.id, nextValue)}
                            error={error}
                            ariaLabel={`Nilai ${component.fullName} ${student.name}`}
                            autoFocus={componentIndex === 0}
                          />
                        ) : (
                          <span className={isBelowKkm ? "font-semibold text-amber-600" : "text-[#20232D]"}>
                            {value === "" || value === null || value === undefined ? "–" : value}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-3 py-3 text-center align-top">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-1">
                        <button type="button" aria-label={`Simpan nilai ${student.name}`} onClick={() => onSave(student)} className="rounded-md p-2 text-emerald-600 hover:bg-emerald-50">
                          <Check aria-hidden="true" className="h-4 w-4" />
                        </button>
                        <button type="button" aria-label={`Batalkan edit ${student.name}`} onClick={onCancel} className="rounded-md p-2 text-red-600 hover:bg-red-50">
                          <X aria-hidden="true" className="h-4 w-4" />
                        </button>
                      </div>
                    ) : canEdit ? (
                      <button type="button" aria-label={`Edit nilai ${student.name}`} onClick={() => onEdit(student)} className="rounded-md p-2 text-[#697184] hover:bg-[#EEF3FC] hover:text-[#0756D9]">
                        <SquarePen aria-hidden="true" className="h-4 w-4" />
                      </button>
                    ) : (
                      <span className="text-xs text-[#8A93A6]">Terkunci</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {records.length === 0 && (
              <tr>
                <td colSpan={12} className="px-4 py-10 text-center text-sm text-[#697184]">
                  Detail nilai halaman pratinjau ini belum tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {Object.values(editErrors || {}).some(Boolean) && (
        <p role="alert" className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs text-red-600">
          Nilai harus berada pada rentang 0–100. Nilai kosong tetap disimpan sebagai data belum lengkap.
        </p>
      )}

      <footer className="flex flex-col gap-3 border-t border-[#D7DCE7] bg-[#FAFBFD] px-4 py-3 text-xs text-[#697184] sm:flex-row sm:items-center sm:justify-between">
        <p>Menampilkan {rangeStart} hingga {rangeEnd} dari {totalStudents} siswa</p>
        <nav aria-label="Pagination database nilai" className="flex items-center gap-1">
          <button type="button" aria-label="Halaman sebelumnya" disabled={page === 1} onClick={() => onPageChange(Math.max(1, page - 1))} className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E1E6F0] bg-white disabled:cursor-not-allowed disabled:opacity-40">
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          </button>
          {[1, 2, 3].filter((pageNumber) => pageNumber <= pageCount).map((pageNumber) => (
            <button key={pageNumber} type="button" aria-label={`Halaman ${pageNumber}`} aria-current={page === pageNumber ? "page" : undefined} onClick={() => onPageChange(pageNumber)} className={`h-8 min-w-8 rounded-md border px-2 ${page === pageNumber ? "border-[#0756D9] bg-[#0756D9] text-white" : "border-[#E1E6F0] bg-white text-[#343946]"}`}>
              {pageNumber}
            </button>
          ))}
          {pageCount > 3 && <span aria-hidden="true" className="px-1">…</span>}
          {pageCount > 3 && (
            <button type="button" aria-label={`Halaman ${pageCount}`} aria-current={page === pageCount ? "page" : undefined} onClick={() => onPageChange(pageCount)} className={`h-8 min-w-8 rounded-md border px-2 ${page === pageCount ? "border-[#0756D9] bg-[#0756D9] text-white" : "border-[#E1E6F0] bg-white text-[#343946]"}`}>
              {pageCount}
            </button>
          )}
          <button type="button" aria-label="Halaman berikutnya" disabled={page === pageCount} onClick={() => onPageChange(Math.min(pageCount, page + 1))} className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E1E6F0] bg-white disabled:cursor-not-allowed disabled:opacity-40">
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </nav>
      </footer>
    </section>
  );
}
