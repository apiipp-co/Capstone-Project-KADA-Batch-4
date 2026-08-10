export function canViewClassSubjectGrades(user) {
  return Boolean(
    user?.role === "teacher" &&
    user?.isHomeroomTeacher === true &&
    user?.homeroomClass?.id,
  );
}
