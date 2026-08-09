import { CirclePlus, FileSearch } from "lucide-react";
import { useState } from "react";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import AssignmentWizard from "../../components/superadmin/AssignmentWizard";
import AssignmentFilledState from "../../components/superadmin/AssignmentFilledState";

export default function ClassAssignmentPage({ gradeLevel }) {
  const [assignmentData, setAssignmentData] = useState([]);
  const [isAssignmentWizardOpen, setIsAssignmentWizardOpen] = useState(false);
  const [wizardSession, setWizardSession] = useState(0);
  const hasAssignments = assignmentData.length > 0;

  const handleCreateClass = () => {
    setWizardSession((current) => current + 1);
    setIsAssignmentWizardOpen(true);
  };

  return (
    <>
      {!hasAssignments ? (
        <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <EmptyState
            icon={FileSearch}
            title={`Penugasan Guru & Siswa Kelas ${gradeLevel}`}
            description={`Belum ada data penugasan untuk periode ini. Silakan mulai membuat data baru untuk mengelola penugasan kelas ${gradeLevel}.`}
            className="max-w-[470px] border border-[#D7DCE7] px-7 py-12 shadow-[0_2px_8px_rgba(30,42,75,0.05)] sm:px-12"
            iconContainerClassName="mb-8 h-28 w-28 rounded-2xl bg-[#F3F6FC] sm:h-32 sm:w-32"
            iconClassName="h-14 w-14 text-[#88A7D8]"
            action={(
              <Button onClick={handleCreateClass} className="h-11 px-6">
                <CirclePlus aria-hidden="true" className="h-5 w-5" /> Mulai Buat Data
              </Button>
            )}
          />
        </div>
      ) : (
        <AssignmentFilledState gradeLevel={gradeLevel} assignments={assignmentData} onStartNew={handleCreateClass} />
      )}
      <AssignmentWizard
        key={wizardSession}
        open={isAssignmentWizardOpen}
        onClose={() => setIsAssignmentWizardOpen(false)}
        onComplete={(createdAssignment) => setAssignmentData((current) => [...current, createdAssignment])}
      />
    </>
  );
}
