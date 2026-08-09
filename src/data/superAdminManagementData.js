export const mainFormula = {
  id: "standard-curriculum-2023",
  name: "Standard Curriculum (2023)",
  status: "active",
  appliedTo: ["Kelas X", "Kelas XI", "Kelas XII"],
  components: [
    { code: "T1", name: "Tugas 1", weight: 6, category: "Tugas" },
    { code: "T2", name: "Tugas 2", weight: 6, category: "Tugas" },
    { code: "T3", name: "Tugas 3", weight: 6, category: "Tugas" },
    { code: "UH1", name: "Ulangan Harian 1", weight: 10, category: "Ulangan Harian" },
    { code: "UH2", name: "Ulangan Harian 2", weight: 10, category: "Ulangan Harian" },
    { code: "UH3", name: "Ulangan Harian 3", weight: 10, category: "Ulangan Harian" },
    { code: "UTS", name: "Ujian Tengah Semester", weight: 26, category: "UTS" },
    { code: "UAS", name: "Ujian Akhir Semester", weight: 26, category: "UAS" },
  ],
};

export const formulaCategoryColors = {
  UAS: "#0756D9",
  UTS: "#3B82F6",
  "Ulangan Harian": "#9BBEFF",
  Tugas: "#DCE8FF",
};

export const teacherDirectory = [
  {
    id: "teacher-1",
    initials: "BS",
    avatarTone: "blue",
    name: "Budi Santoso, S.Pd",
    email: "budi.santoso@sekolah.sch.id",
    isHomeroomTeacher: true,
    subjectAssignment: "Matematika",
  },
  {
    id: "teacher-2",
    initials: "SA",
    avatarTone: "orange",
    name: "Siti Aminah, M.Pd",
    email: "siti.aminah@sekolah.sch.id",
    isHomeroomTeacher: true,
    subjectAssignment: "IPA",
  },
  {
    id: "teacher-3",
    initials: "AF",
    avatarTone: "slate",
    name: "Ahmad Fauzi, S.T",
    email: "ahmad.fauzi@sekolah.sch.id",
    isHomeroomTeacher: false,
    subjectAssignment: "Fisika",
  },
  {
    id: "teacher-4",
    initials: "RS",
    avatarTone: "lavender",
    name: "Ratna Sari, S.Pd",
    email: "ratna.sari@sekolah.sch.id",
    isHomeroomTeacher: true,
    subjectAssignment: "Matematika",
  },
];

export const studentAttendanceRecords = [
  {
    id: "attendance-1",
    studentName: "Ahmad Budi Santoso",
    nis: "1001293",
    className: "X MIPA 1",
    status: "present",
    note: "-",
  },
  {
    id: "attendance-2",
    studentName: "Siti Nurhaliza",
    nis: "1001294",
    className: "X MIPA 1",
    status: "sick",
    note: "Surat Dokter terlampir",
  },
  {
    id: "attendance-3",
    studentName: "Dian Sastrowardoyo",
    nis: "1001295",
    className: "X MIPA 1",
    status: "permission",
    note: "Acara Keluarga",
  },
  {
    id: "attendance-4",
    studentName: "Reza Rahadian",
    nis: "1001296",
    className: "X MIPA 1",
    status: "absent",
    note: "Tanpa keterangan",
  },
  {
    id: "attendance-5",
    studentName: "Nicholas Saputra",
    nis: "1001297",
    className: "X MIPA 1",
    status: "present",
    note: "-",
  },
];

export const studentAttendanceTotal = 32;

export const subjectDatabaseRecords = [
  {
    id: "subject-1",
    name: "Matematika Wajib",
    filterName: "Matematika",
    teacher: { id: "teacher-ahmad", name: "Ahmad Ridwan, S.Pd., M.Kom" },
    level: "Kelas X",
    kkm: 75,
    formula: "Rumus Utama",
  },
  {
    id: "subject-2",
    name: "Bahasa Indonesia",
    filterName: "Bahasa Indonesia",
    teacher: { id: "teacher-siti", name: "Siti Aminah, M.Pd" },
    level: "Kelas X",
    kkm: 80,
    formula: "Rumus Utama",
  },
  {
    id: "subject-3",
    name: "Fisika Lintas Minat",
    filterName: "Fisika",
    teacher: { id: "teacher-budi", name: "Budi Santoso, S.Si" },
    level: "Kelas X",
    kkm: 70,
    formula: "Rumus Lainnya",
  },
  {
    id: "subject-4",
    name: "Pendidikan Jasmani",
    filterName: "Pendidikan Jasmani",
    teacher: { id: "teacher-dewi", name: "Dewi Lestari, S.E" },
    level: "Kelas X",
    kkm: 75,
    formula: "Rumus Lainnya",
  },
];

export const subjectDatabaseTotalPages = 4;

export const gradeDatabaseRecords = [
  {
    id: "grade-student-1",
    name: "Ahmad Fadillah",
    nis: "1012345",
    scores: { T1: 85, T2: 88, T3: 90, UH1: 80, UH2: 82, UH3: 85, UTS: 84, UAS: 90 },
  },
  {
    id: "grade-student-2",
    name: "Budi Santoso",
    nis: "1012346",
    scores: { T1: 78, T2: 82, T3: 80, UH1: 65, UH2: 70, UH3: 72, UTS: 75, UAS: 80 },
  },
  {
    id: "grade-student-3",
    name: "Citra Kirana",
    nis: "1012347",
    scores: { T1: 92, T2: 90, T3: 95, UH1: 88, UH2: 90, UH3: 92, UTS: 94, UAS: 95 },
  },
  {
    id: "grade-student-4",
    name: "Dian Sastrowardoyo",
    nis: "1012348",
    scores: { T1: 80, T2: 85, T3: 82, UH1: 82, UH2: 84, UH3: 86, UTS: 88, UAS: 86 },
  },
  {
    id: "grade-student-5",
    name: "Eka Putra",
    nis: "1012349",
    scores: { T1: 70, T2: 75, T3: 76, UH1: 72, UH2: 74, UH3: 76, UTS: 78, UAS: 82 },
  },
  {
    id: "grade-student-6",
    name: "Farhan Maulana",
    nis: "1012350",
    scores: { T1: 88, T2: 85, T3: 87, UH1: 90, UH2: 91, UH3: 89, UTS: 92, UAS: 89 },
  },
];

export const gradeDatabaseTotalStudents = 32;

export const reportDatabaseRecords = [
  {
    id: "report-1",
    studentName: "Ahmad Rizky",
    initials: "AR",
    avatarTone: "blue",
    nis: "2021001",
    average: 88.5,
    averageTone: "blue",
    status: "promoted",
    reportStatus: "distributed",
    canDownload: true,
  },
  {
    id: "report-2",
    studentName: "Budi Santoso",
    initials: "BS",
    avatarTone: "orange",
    nis: "2021002",
    average: 75.2,
    averageTone: "neutral",
    status: "promoted",
    reportStatus: "distributed",
    canDownload: true,
  },
  {
    id: "report-3",
    studentName: "Citra Lestari",
    initials: "CL",
    avatarTone: "slate",
    nis: "2021003",
    average: 92,
    averageTone: "blue",
    status: "promoted",
    reportStatus: "distributed",
    canDownload: true,
  },
  {
    id: "report-4",
    studentName: "Deni Wijaya",
    initials: "DW",
    avatarTone: "red",
    nis: "2021004",
    average: 58.4,
    averageTone: "red",
    status: "not_promoted",
    reportStatus: "distributed",
    canDownload: true,
  },
];

export const reportDatabaseTotalStudents = 32;
