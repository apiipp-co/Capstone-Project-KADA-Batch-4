import { teacherUser } from "../data/teacherData";

const accounts = [
  {
    email: "admin@sekolah.edu",
    password: "Admin123!",
    user: {
      id: "USR-001",
      name: "Administrator EduTrack",
      email: "admin@sekolah.edu",
      role: "admin",
    },
  },
  { email: "guru@sekolah.edu", password: "Guru123!", user: teacherUser },
  {
    email: "siswa@sekolah.edu",
    password: "Siswa123!",
    user: {
      id: "STD-DEMO",
      name: "Siswa Demo",
      email: "siswa@sekolah.edu",
      role: "student",
    },
  },
];

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

export async function login({ email, password }) {
  await wait(850);
  const account = accounts.find(
    (item) => item.email === email.trim().toLowerCase() && item.password === password,
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
