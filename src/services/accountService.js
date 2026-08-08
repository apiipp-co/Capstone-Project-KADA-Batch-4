import { defaultTeacherProfile } from "../data/teacherProfileData";

export const TEACHER_PROFILE_KEY = "edutrack_teacher_profile";

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

export async function getTeacherProfile() {
  await wait(450);
  try {
    const stored = JSON.parse(localStorage.getItem(TEACHER_PROFILE_KEY));
    if (stored?.id === defaultTeacherProfile.id) return stored;
  } catch {
    // Gunakan profil demo terverifikasi ketika cache tidak valid.
  }
  localStorage.setItem(TEACHER_PROFILE_KEY, JSON.stringify(defaultTeacherProfile));
  return defaultTeacherProfile;
}

