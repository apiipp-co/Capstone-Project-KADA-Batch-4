import { FileCheck2, LoaderCircle, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { mockGeneratedStudents, mockGeneratedTeachers } from "../../../data/superAdminData";
import Button from "../../ui/Button";
import Toast from "../../ui/Toast";
import BulkAccountUploadPage from "./BulkAccountUploadPage";
import GeneratedAccountTable from "./GeneratedAccountTable";

const GENERATION_STATES = {
  SUMMARY: "summary",
  GENERATING: "generating",
  GENERATED: "generated",
  ERROR: "error",
};

const ACCOUNT_CONFIG = {
  teacher: {
    title: "Pembuatan Akun Guru",
    entityLabel: "guru",
    rows: mockGeneratedTeachers,
    description:
      "Anda dapat membuat password untuk akses login ke akun guru secara otomatis. Data guru bersumber dari file Excel yang sebelumnya telah diunggah dan divalidasi.",
    successMessage: "Pratinjau akun guru berhasil diproses. Belum ada akun production yang dibuat.",
  },
  student: {
    title: "Pembuatan Akun Siswa",
    entityLabel: "siswa",
    rows: mockGeneratedStudents,
    description:
      "Anda dapat membuat password untuk akses login ke akun siswa secara otomatis. Data siswa bersumber dari file Excel yang sebelumnya telah diunggah dan divalidasi.",
    successMessage: "Pratinjau akun siswa berhasil diproses. Belum ada akun production yang dibuat.",
  },
};

export default function BulkAccountGenerationPage({ accountType }) {
  const config = ACCOUNT_CONFIG[accountType];
  const [uploadedFile, setUploadedFile] = useState(null);
  const [generationStatus, setGenerationStatus] = useState(GENERATION_STATES.SUMMARY);
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  if (!config) throw new Error(`Unsupported account generation type: ${accountType}`);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleUploadSuccess = (fileMetadata) => {
    setUploadedFile(fileMetadata);
    setGenerationStatus(GENERATION_STATES.SUMMARY);
  };

  const generateAccounts = async () => {
    if (generationStatus === GENERATION_STATES.GENERATING) return;

    setGenerationStatus(GENERATION_STATES.GENERATING);
    try {
      // TODO: replace with backend bulk account generation API.
      await new Promise((resolve) => {
        timerRef.current = setTimeout(resolve, 1200);
      });
      setGenerationStatus(GENERATION_STATES.GENERATED);
      setToast({ type: "success", message: config.successMessage });
    } catch {
      setGenerationStatus(GENERATION_STATES.ERROR);
    }
  };

  const generating = generationStatus === GENERATION_STATES.GENERATING;
  const generated = generationStatus === GENERATION_STATES.GENERATED;

  return (
    <BulkAccountUploadPage accountType={accountType} onUploadSuccess={handleUploadSuccess}>
      {uploadedFile && (
        <>
          <section className="mt-7 rounded-lg border border-[#C5CDDC] bg-white p-5" aria-labelledby={`${accountType}-file-summary-title`}>
            <div className="flex items-start gap-3">
              <FileCheck2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#0756D9]" />
              <div>
                <h2 id={`${accountType}-file-summary-title`} className="text-sm font-medium text-[#20232D]">Ringkasan File</h2>
                <p className="mt-3 max-w-[780px] text-xs leading-5 text-[#555D6E]">{config.description}</p>
              </div>
            </div>

            <Button onClick={generateAccounts} disabled={generating} className="mt-5 h-11 w-full">
              {generating ? (
                <><LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> Memproses Akun...</>
              ) : (
                <><Sparkles aria-hidden="true" className="h-4 w-4" /> Buat Akun Otomatis Dengan AI</>
              )}
            </Button>

            {generationStatus === GENERATION_STATES.ERROR && (
              <p role="alert" className="mt-3 text-xs text-red-600">Pratinjau akun gagal diproses. Silakan coba kembali.</p>
            )}
          </section>

          {generated && (
            <GeneratedAccountTable
              entityType={accountType}
              rows={config.rows}
              title="Preview Akun"
              subtitle="Pratinjau data sebelum akun benar-benar dibuat."
            />
          )}
        </>
      )}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </BulkAccountUploadPage>
  );
}
