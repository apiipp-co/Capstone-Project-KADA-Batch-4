import { Navigate } from "react-router-dom";
import { teacherUser } from "../../data/teacherData";

export default function TeacherHomeroomReportsPage() {
  if (!teacherUser.isHomeroomTeacher) return <Navigate to="/403" replace />;
  return <div className="px-4 py-10 sm:px-7"><section className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-soft"><h1 className="text-2xl font-bold">Rapor Semester Wali Kelas</h1><p className="mt-3 text-sm leading-6 text-[#64748B]">Modul ini terpisah dari finalisasi rapor mapel. Wali Kelas dapat memeriksa kesiapan semua mapel sebelum finalisasi dan distribusi semester.</p></section></div>;
}

