export const assessmentComponents = [
  { id: "T1", label: "T1", fullName: "Tugas 1", weight: 6 },
  { id: "T2", label: "T2", fullName: "Tugas 2", weight: 6 },
  { id: "T3", label: "T3", fullName: "Tugas 3", weight: 6 },
  { id: "UH1", label: "UH1", fullName: "Ulangan Harian 1", weight: 10 },
  { id: "UH2", label: "UH2", fullName: "Ulangan Harian 2", weight: 10 },
  { id: "UH3", label: "UH3", fullName: "Ulangan Harian 3", weight: 10 },
  { id: "UTS", label: "UTS", fullName: "Ujian Tengah Semester", weight: 26 },
  { id: "UAS", label: "UAS", fullName: "Ujian Akhir Semester", weight: 26 },
];

export const TOTAL_ASSESSMENT_WEIGHT = assessmentComponents.reduce(
  (total, component) => total + component.weight,
  0,
);

// Fitur sikap perlu validasi sekolah sebelum masuk MVP produksi.
export const ENABLE_CHARACTER_ASSESSMENT = false;
