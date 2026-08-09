import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Info,
  Plus,
  Search,
} from "lucide-react";
import { useRef, useState } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Toast from "../ui/Toast";
import {
  assignmentAcademicYearOptions,
  assignmentSemesterOptions,
  assignmentSubjects,
  assignmentTeachers,
  createInitialAssignmentClasses,
} from "../../data/assignmentWizardData";
import { cn } from "../../utils/cn";
import { validateImportFile } from "../../utils/importFile";
import ImportFileDropzone from "./ImportFileDropzone";

const ASSIGNMENT_STEPS = [
  { id: 1, label: "Set Periode" },
  { id: 2, label: "Siswa & Kelas" },
  { id: 3, label: "Wali Kelas & Guru Mapel" },
  { id: 4, label: "Selesai" },
];

const createInitialDraft = () => ({
  period: {
    semester: "",
    academicYear: "",
  },
  studentClassFile: null,
  classes: createInitialAssignmentClasses(),
});

function AssignmentSelect({ label, value, onChange, placeholder, options, showSearch = false }) {
  return (
    <label className="relative block min-w-0">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={onChange}
        className="h-10 w-full appearance-none rounded-md border border-[#D7DCE7] bg-white pl-3 pr-9 text-sm text-[#343946] outline-none transition focus:border-[#0756D9] focus:ring-2 focus:ring-[#DCE8FF]"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>{option.name}</option>
        ))}
      </select>
      {showSearch && !value ? (
        <Search aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A4AABC]" />
      ) : (
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#697184]" />
      )}
    </label>
  );
}

export default function AssignmentWizard({ open, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [assignmentDraft, setAssignmentDraft] = useState(createInitialDraft);
  const [assignmentFileError, setAssignmentFileError] = useState("");
  const [subjectErrors, setSubjectErrors] = useState({});
  const [showStepThreeValidation, setShowStepThreeValidation] = useState(false);
  const [subjectsExpanded, setSubjectsExpanded] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState(null);
  const addedSubjectCounter = useRef(0);

  const resetWizard = () => {
    setCurrentStep(1);
    setAssignmentDraft(createInitialDraft());
    setAssignmentFileError("");
    setSubjectErrors({});
    setShowStepThreeValidation(false);
    setSubjectsExpanded(true);
    setIsProcessing(false);
    addedSubjectCounter.current = 0;
  };

  const closeWizard = () => {
    resetWizard();
    onClose();
  };

  const selectAssignmentFile = (file) => {
    const validationError = validateImportFile(file);
    setAssignmentFileError(validationError);
    setAssignmentDraft((current) => ({
      ...current,
      studentClassFile: file && !validationError ? file : null,
    }));
  };

  const updatePeriod = (field, value) => {
    setAssignmentDraft((current) => ({
      ...current,
      period: {
        ...current.period,
        [field]: value,
      },
    }));
  };

  const updateClass = (classId, updater) => {
    setAssignmentDraft((current) => ({
      ...current,
      classes: current.classes.map((classItem) => (
        classItem.id === classId ? updater(classItem) : classItem
      )),
    }));
  };

  const updateHomeroomTeacher = (classId, teacherId) => {
    updateClass(classId, (classItem) => ({ ...classItem, homeroomTeacherId: teacherId }));
  };

  const updateSubject = (classId, rowId, field, value) => {
    const classItem = assignmentDraft.classes.find((item) => item.id === classId);
    const duplicate = field === "subjectId" && value && classItem?.subjects.some(
      (subject) => subject.id !== rowId && subject.subjectId === value,
    );

    if (duplicate) {
      setSubjectErrors((current) => ({ ...current, [rowId]: "Mata pelajaran sudah ditambahkan." }));
      return;
    }

    setSubjectErrors((current) => ({ ...current, [rowId]: "" }));
    updateClass(classId, (currentClass) => ({
      ...currentClass,
      subjects: currentClass.subjects.map((subject) => (
        subject.id === rowId ? { ...subject, [field]: value } : subject
      )),
    }));
  };

  const addSubject = (classId) => {
    addedSubjectCounter.current += 1;
    updateClass(classId, (classItem) => ({
      ...classItem,
      subjects: [
        ...classItem.subjects,
        {
          id: `subject-added-${addedSubjectCounter.current}`,
          subjectId: "",
          teacherId: "",
        },
      ],
    }));
  };

  const isStepThreeValid = assignmentDraft.classes.length > 0 && assignmentDraft.classes.every((classItem) => {
    const selectedSubjects = classItem.subjects.map((subject) => subject.subjectId).filter(Boolean);
    return Boolean(classItem.homeroomTeacherId)
      && classItem.subjects.length > 0
      && classItem.subjects.every((subject) => subject.subjectId && subject.teacherId)
      && new Set(selectedSubjects).size === selectedSubjects.length;
  });

  const handleSaveAssignments = async () => {
    setShowStepThreeValidation(true);
    if (!isStepThreeValid || isProcessing) return;

    try {
      setIsProcessing(true);
      // TODO: replace with assignment creation API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentStep(4);
    } finally {
      setIsProcessing(false);
    }
  };

  const finishWizard = () => {
    const createdAt = new Date().toISOString();
    onComplete?.({
      id: `mock-class-x-assignment-${createdAt}`,
      createdAt,
      ...assignmentDraft,
    });
    closeWizard();
  };

  const downloadTemplate = () => {
    setToast({ type: "success", message: "Template Excel penugasan belum tersedia pada mode frontend." });
  };

  return (
    <>
      <Modal
        key={currentStep}
        open={open}
        onClose={closeWizard}
        title="Mulai Penugasan Baru"
        dismissible={!isProcessing}
        panelClassName="!w-[calc(100vw-24px)] !max-w-none !max-h-[calc(100vh-24px)] rounded-lg sm:!w-[calc(100vw-40px)] sm:!max-h-[calc(100vh-48px)] lg:!w-[min(920px,calc(100vw-64px))]"
      >
        <div className="sm:px-2">
          <ol aria-label="Tahapan pembuatan penugasan" className="grid grid-cols-4">
            {ASSIGNMENT_STEPS.map((step, index) => {
              const success = currentStep === 4;
              const complete = success || step.id < currentStep;
              const active = step.id === currentStep;
              return (
                <li
                  key={step.id}
                  aria-current={active ? "step" : undefined}
                  className="relative flex min-w-0 flex-col items-center text-center"
                >
                  {index < ASSIGNMENT_STEPS.length - 1 && (
                    <span className={cn(
                      "absolute left-1/2 right-[-50%] top-4 h-0.5",
                      success || currentStep > step.id ? "bg-emerald-500" : "bg-[#D7DCE7]",
                    )} />
                  )}
                  <span className={cn(
                    "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    complete && "bg-emerald-500 text-white",
                    active && !success && "bg-[#0756D9] text-white ring-4 ring-[#DCE8FF]",
                    !complete && !active && "bg-[#E4E7EC] text-[#697184]",
                  )}>
                    {complete ? <Check aria-hidden="true" className="h-4 w-4" /> : step.id}
                  </span>
                  <span className={cn(
                    "mt-2 max-w-[120px] text-[10px] leading-4 sm:text-[11px]",
                    active && !success ? "font-semibold text-[#0756D9]" : complete ? "text-emerald-600" : "text-[#555D6E]",
                  )}>{step.label}</span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-5 border-t border-[#D7DCE7] py-6 sm:py-7">
          {currentStep === 1 && (
            <div className="flex flex-col items-center px-1 text-center" aria-live="polite">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#E8EFFF] text-[#0756D9]">
                <CalendarDays aria-hidden="true" className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[#20232D]">Set Periode Akademik</h3>
              <p className="mt-2 max-w-[470px] text-sm leading-5 text-[#555D6E]">
                Tentukan Semester dan Tahun Ajaran untuk memulai proses penugasan siswa ke kelas dan wali kelas.
              </p>

              <div className="mt-6 grid w-full max-w-[520px] gap-4 text-left sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-medium text-[#343946]">Pilih Semester</p>
                  <AssignmentSelect
                    label="Pilih Semester"
                    value={assignmentDraft.period.semester}
                    onChange={(event) => updatePeriod("semester", event.target.value)}
                    placeholder="Pilih Semester..."
                    options={assignmentSemesterOptions}
                  />
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-[#343946]">Pilih Tahun Ajaran</p>
                  <AssignmentSelect
                    label="Pilih Tahun Ajaran"
                    value={assignmentDraft.period.academicYear}
                    onChange={(event) => updatePeriod("academicYear", event.target.value)}
                    placeholder="Pilih Tahun Ajaran..."
                    options={assignmentAcademicYearOptions}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <>
              <h3 className="text-lg font-semibold text-[#20232D]">Unggah Data Siswa &amp; Kelas</h3>
              <p className="mt-2 text-sm leading-5 text-[#555D6E]">
                Unggah file Excel yang berisi daftar siswa dan kelasnya. Pastikan format sesuai dengan template yang disediakan.
              </p>

              <ImportFileDropzone
                variant="assignment"
                file={assignmentDraft.studentClassFile}
                error={assignmentFileError}
                onFileSelect={selectAssignmentFile}
                inputLabel="Pilih file Excel siswa dan kelas"
              />

              <div className="mt-3 rounded-lg border border-[#BCD0F6] bg-[#EEF4FF] p-4">
                <div className="flex items-start gap-3">
                  <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#526076]" />
                  <div>
                    <h4 className="text-sm font-semibold text-[#343946]">Butuh format standar?</h4>
                    <p className="mt-1 text-xs leading-4 text-[#555D6E]">Gunakan template yang telah disediakan untuk memastikan proses unggah berjalan lancar tanpa error validasi kolom.</p>
                    <button type="button" onClick={downloadTemplate} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#0756D9] hover:underline">
                      <Download aria-hidden="true" className="h-4 w-4" /> Download Template Excel
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <div aria-live="polite">
              <h3 className="text-lg font-semibold text-[#20232D]">Penugasan Wali Kelas dan Guru Mapel</h3>
              <p className="mt-2 max-w-[590px] text-sm leading-5 text-[#555D6E]">
                Data kelas berhasil diekstrak. Silakan tetapkan wali kelas dan guru mapel yang akan bertugas untuk masing-masing kelas.
              </p>

              {assignmentDraft.classes.map((classItem) => {
                const homeroomTeacher = assignmentTeachers.find((teacher) => teacher.id === classItem.homeroomTeacherId);
                return (
                  <div key={classItem.id} className="mt-5 overflow-hidden rounded-lg border border-[#D7DCE7] bg-white">
                    <div className="hidden grid-cols-[minmax(0,1fr)_minmax(220px,1.5fr)] border-b border-[#D7DCE7] bg-[#F7F8FA] px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-[#697184] sm:grid">
                      <span>Kelas</span>
                      <span>Wali Kelas</span>
                    </div>
                    <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(220px,1.5fr)] sm:items-center">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#2F67ED] text-[11px] font-semibold text-white">X-A</span>
                        <div>
                          <p className="text-sm font-medium text-[#20232D]">{classItem.name}</p>
                          <p className="mt-0.5 text-xs text-[#697184]">{classItem.studentCount} Siswa</p>
                        </div>
                      </div>
                      <div className="relative">
                        {homeroomTeacher && (
                          <span className="pointer-events-none absolute left-3 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-[#EEF0FF] text-[9px] font-semibold text-[#6B72B6]">
                            {homeroomTeacher.initials}
                          </span>
                        )}
                        <div className={homeroomTeacher ? "[&_select]:pl-10" : ""}>
                          <AssignmentSelect
                            label={`Wali kelas untuk ${classItem.name}`}
                            value={classItem.homeroomTeacherId}
                            onChange={(event) => updateHomeroomTeacher(classItem.id, event.target.value)}
                            placeholder="Pilih Wali Kelas..."
                            options={assignmentTeachers}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[#D7DCE7]">
                      <button
                        type="button"
                        aria-expanded={subjectsExpanded}
                        onClick={() => setSubjectsExpanded((current) => !current)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#343946] hover:bg-[#F7F8FA]"
                      >
                        Mata Pelajaran
                        {subjectsExpanded ? <ChevronUp aria-hidden="true" className="h-4 w-4" /> : <ChevronDown aria-hidden="true" className="h-4 w-4" />}
                      </button>

                      {subjectsExpanded && (
                        <div className="border-t border-[#D7DCE7]">
                          <div className="hidden grid-cols-2 gap-3 border-b border-[#D7DCE7] bg-[#F7F8FA] px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-[#697184] sm:grid">
                            <span>Mata Pelajaran</span>
                            <span>Guru Pengampu</span>
                          </div>
                          <div className="divide-y divide-[#E6E9F0] px-4">
                            {classItem.subjects.map((subject, subjectIndex) => (
                              <div key={subject.id} className="grid gap-2 py-3 sm:grid-cols-2 sm:gap-3">
                                <AssignmentSelect
                                  label={`Mata pelajaran baris ${subjectIndex + 1}`}
                                  value={subject.subjectId}
                                  onChange={(event) => updateSubject(classItem.id, subject.id, "subjectId", event.target.value)}
                                  placeholder="Pilih Mata Pelajaran..."
                                  options={assignmentSubjects}
                                />
                                <AssignmentSelect
                                  label={`Guru pengampu baris ${subjectIndex + 1}`}
                                  value={subject.teacherId}
                                  onChange={(event) => updateSubject(classItem.id, subject.id, "teacherId", event.target.value)}
                                  placeholder="Pilih Guru..."
                                  options={assignmentTeachers}
                                  showSearch
                                />
                                {subjectErrors[subject.id] && (
                                  <p role="alert" className="text-xs font-medium text-[#DC2626] sm:col-span-2">{subjectErrors[subject.id]}</p>
                                )}
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => addSubject(classItem.id)}
                            className="flex w-full items-center justify-center gap-1 border-t border-dashed border-[#0756D9] px-4 py-3 text-xs font-medium text-[#0756D9] hover:bg-[#F2F6FF]"
                          >
                            <Plus aria-hidden="true" className="h-4 w-4" /> Tambah Mata Pelajaran
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {showStepThreeValidation && !isStepThreeValid && (
                <p role="alert" className="mt-3 text-sm font-medium text-[#DC2626]">
                  Lengkapi wali kelas, mata pelajaran, dan guru pengampu sebelum menyimpan.
                </p>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="flex flex-col items-center px-3 py-8 text-center sm:py-10" aria-live="polite">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-500 shadow-[0_8px_18px_rgba(16,185,129,0.25)]">
                <CheckCircle2 aria-hidden="true" className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-[#20232D]">Semua data berhasil dibuat</h3>
              <p className="mt-3 max-w-[410px] text-sm leading-5 text-[#555D6E]">
                Data penugasan siswa dan wali kelas telah berhasil disimpan ke sistem. Anda dapat meninjau kembali data ini di halaman utama Penugasan Kelas X.
              </p>
            </div>
          )}
        </div>

        {currentStep === 1 && (
          <div className="flex flex-col-reverse gap-3 border-t border-[#D7DCE7] bg-white pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="secondary" onClick={closeWizard} className="h-10 px-5">Batal</Button>
            <Button
              onClick={() => setCurrentStep(2)}
              disabled={!assignmentDraft.period.semester || !assignmentDraft.period.academicYear}
              className="h-10 px-5"
            >
              Set &amp; Lanjutkan <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex items-center justify-between border-t border-[#D7DCE7] bg-white pt-4">
            <Button variant="secondary" onClick={() => setCurrentStep(1)} className="h-10 px-5">Kembali</Button>
            <Button
              onClick={() => setCurrentStep(3)}
              disabled={!assignmentDraft.studentClassFile || Boolean(assignmentFileError)}
              className="h-10 px-5"
            >
              Lanjutkan <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex flex-col gap-3 border-t border-[#D7DCE7] bg-white pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="secondary" onClick={closeWizard} disabled={isProcessing} className="h-10 px-5">Batalkan</Button>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="secondary" onClick={() => setCurrentStep(2)} disabled={isProcessing} className="h-10 px-5">Kembali</Button>
              <Button
                onClick={handleSaveAssignments}
                loading={isProcessing}
                aria-busy={isProcessing}
                className="h-10 px-5"
              >
                Simpan &amp; Proses <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="flex justify-center border-t border-[#E6E9F0] bg-[#F7F8FA] pt-4">
            <Button onClick={finishWizard} className="h-10 min-w-[160px] px-8">Selesai</Button>
          </div>
        )}
      </Modal>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
