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
  "STD-001": { T1: 85, T2: 88, UH1: 82, UH2: 84, UTS: 80, UAS: 85 },
  "STD-002": { T1: 90, T2: 92, UH1: 88, UH2: 90, UTS: 85, UAS: 92 },
  "STD-003": { T1: 75, T2: 78, UH1: 72, UH2: 74, UTS: 70, UAS: 75 },
};

export const defaultLearningTopics = {
  T1: "Trigonometri",
  T2: "Persamaan Kuadrat",
  UH1: "Fungsi dan Grafik",
  UH2: "Statistika Dasar",
  UTS: "Materi Bab 1–4",
  UAS: "Materi Semester Ganjil",
};
