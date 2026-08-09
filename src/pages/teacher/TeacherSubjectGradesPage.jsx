import { CircleAlert, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import HomeroomGradeEmptyState from "../../components/grades/HomeroomGradeEmptyState";
import HomeroomGradeFilters from "../../components/grades/HomeroomGradeFilters";
import GradeTable from "../../components/grades/GradeTable";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { assessmentComponents } from "../../data/assessmentComponents";
import { GRADE_KKM } from "../../data/gradeData";
import { getHomeroomSubjectGrades } from "../../services/gradeService";

const initialFilters = {
  academicYear: "2026/2027",
  semester: "GANJIL",
  subjectId: "SUB-001",
};

export default function TeacherSubjectGradesPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [pageState, setPageState] = useState("initial");
  const [data, setData] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const sortedStudents = useMemo(() => {
    const students = [...(data?.students || [])];
    return students.sort((a, b) => sortDirection === "asc"
      ? a.name.localeCompare(b.name, "id")
      : b.name.localeCompare(a.name, "id"));
  }, [data?.students, sortDirection]);

  const changeFilters = (nextFilters) => {
    setFilters(nextFilters);
    setData(null);
    setPageState("initial");
  };

  const loadGrades = async () => {
    setPageState("loading");
    try {
      const result = await getHomeroomSubjectGrades(filters);
      setData(result);
      setPageState(result.students.length ? "loaded" : "empty");
    } catch {
      setData(null);
      setPageState("error");
    }
  };

  return (
    <div className="px-4 py-8 sm:px-7 lg:px-6 xl:px-10">
      <div className="mx-auto max-w-[1100px]">
        <header>
          <h1 className="text-[26px] font-bold tracking-[-0.035em] text-[#202838]">Lihat Nilai Siswa</h1>
          <p className="mt-1 max-w-[690px] text-sm leading-6 text-[#64748B]">
            Lihat nilai dari siswa kelas Anda yang sudah diinputkan oleh guru yang bertugas.
          </p>
        </header>

        <HomeroomGradeFilters
          filters={filters}
          onChange={changeFilters}
          onShow={loadGrades}
          loading={pageState === "loading"}
        />

        {pageState === "initial" && <HomeroomGradeEmptyState />}
        {pageState === "loading" && (
          <section role="status" className="mx-auto mt-20 flex max-w-md flex-col items-center rounded-2xl bg-white p-10 shadow-soft">
            <Spinner className="h-8 w-8 text-[#2F67ED]" />
            <p className="mt-4 text-sm font-medium text-[#64748B]">Memuat nilai siswa...</p>
          </section>
        )}
        {pageState === "empty" && <HomeroomGradeEmptyState noStudents />}
        {pageState === "error" && (
          <section role="alert" className="mx-auto mt-16 max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-soft">
            <CircleAlert aria-hidden="true" className="mx-auto h-10 w-10 text-red-500" />
            <h2 className="mt-4 text-xl font-bold">Data nilai gagal dimuat</h2>
            <p className="mt-2 text-sm text-[#64748B]">Periksa kembali filter dan coba muat ulang data.</p>
            <Button onClick={loadGrades} className="mt-6">
              <RefreshCw aria-hidden="true" className="h-4 w-4" /> Coba Lagi
            </Button>
          </section>
        )}

        {pageState === "loaded" && data && (
          <GradeTable
            students={sortedStudents}
            components={assessmentComponents}
            grades={data.grades}
            finalGrades={data.finalGrades}
            kkm={GRADE_KKM}
            sortDirection={sortDirection}
            onSort={() => setSortDirection((current) => current === "asc" ? "desc" : "asc")}
            readOnly
          />
        )}
      </div>
    </div>
  );
}
