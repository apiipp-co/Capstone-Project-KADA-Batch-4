const avatarStyles = {
  blue: "bg-[#2F67ED]",
  purple: "bg-[#8754E8]",
  orange: "bg-[#C64B00]",
};

export default function GradeStudentCell({ student }) {
  return (
    <th
      scope="row"
      className="sticky left-0 z-10 bg-white px-6 py-3 text-left font-normal group-hover:bg-[#FBFCFE]"
    >
      <div className="flex items-center gap-3">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white ${avatarStyles[student.avatarColor] || avatarStyles.blue}`}>
          {student.initials}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-[#20232D]">{student.name}</span>
          <span className="mt-0.5 block text-xs text-[#545968]">NIS: {student.nis}</span>
        </span>
      </div>
    </th>
  );
}
