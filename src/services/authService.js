import { homeroomTeacherUser, teacherUser } from "../data/teacherData";
import { secondaryStudentUser, studentUser } from "../data/studentData";

const accounts = [
  {
    email: "budi.raharjo@admin.edu",
    username: "budi.raharjo",
    password: "Admin123!",
    user: {
      id: "SUPERADMIN-001",
      name: "Budi Raharjo",
      email: "budi.raharjo@admin.edu",
      role: "superadmin",
      roleLabel: "Superadmin",
      systemRoleLabel: "System Admin",
    },
  },
  {
    email: "admin@sekolah.edu",
    username: "admin",
    password: "Admin123!",
    user: {
      id: "USR-001",
      name: "Administrator EduTrack",
      email: "admin@sekolah.edu",
      role: "admin",
    },
  },
  { email: "guru@sekolah.edu", username: "guru", password: "Guru123!", user: teacherUser },
  { email: "walikelas@sekolah.edu", username: "walikelas", password: "Wali123!", user: homeroomTeacherUser },
  {
    email: "siswa@sekolah.edu",
    username: studentUser.username,
    password: "Siswa123!",
    user: studentUser,
  },
  {
    email: "raka@sekolah.edu",
    username: secondaryStudentUser.username,
    password: "Siswa123!",
    user: secondaryStudentUser,
  },
];

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

export async function login({ username, password }) {
  await wait(850);
  const normalizedUsername = username.trim().toLowerCase();
  const account = accounts.find(
    (item) =>
      (item.username.toLowerCase() === normalizedUsername || item.email === normalizedUsername) &&
      item.password === password,
  );

  if (!account) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return {
    user: account.user,
    token: `demo-token-${account.user.id}`,
  };
}

export async function requestPasswordReset() {
  await wait(750);
  return { success: true };
}
