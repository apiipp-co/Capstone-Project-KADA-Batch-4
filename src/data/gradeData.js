export const GRADE_KKM = 75;

export const GRADE_STATUSES = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  FINALIZED_SUBJECT: "FINALIZED_SUBJECT",
  REOPENED: "REOPENED",
};

export const gradeStudents = [
  {
    id: "STD-001",
    name: "Aditya Ananta",
    nis: "102938",
    initials: "AA",
    avatarColor: "blue",
  },
  {
    id: "STD-002",
    name: "Bunga Safira",
    nis: "102939",
    initials: "BS",
    avatarColor: "purple",
  },
  {
    id: "STD-003",
    name: "Chandra Dinata",
    nis: "102940",
    initials: "CD",
    avatarColor: "orange",
  },
];

export const initialGrades = {
  "STD-001": { T1: 85, T2: 88, T3: 90, UH1: 82, UH2: 84, UH3: 86, UTS: 80, UAS: 85 },
  "STD-002": { T1: 90, T2: 92, T3: 95, UH1: 88, UH2: 90, UH3: 92, UTS: 85, UAS: 92 },
  "STD-003": { T1: 75, T2: 78, T3: 70, UH1: 72, UH2: 74, UH3: 72, UTS: 70, UAS: 75 },
};

export const defaultLearningTopics = {
  T1: "Trigonometri",
  T2: "Aljabar Linear",
  T3: "SPLDV",
  UH1: "Trigonometri",
  UH2: "Aljabar Linear",
  UH3: "SPLDV",
  UTS: "Ujian Tengah Semester",
  UAS: "Ujian Akhir Semester",
};

export const homeroomSubjects = [
  { id: "SUB-001", name: "Matematika Wajib" },
  { id: "SUB-002", name: "Bahasa Inggris" },
  { id: "SUB-003", name: "Bahasa Indonesia" },
  { id: "SUB-004", name: "Fisika" },
  { id: "SUB-005", name: "Kimia" },
];

export const homeroomFinalGrades = {
  "STD-001": 83.7,
  "STD-002": 89.5,
  "STD-003": 73.7,
};
