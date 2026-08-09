import { calculateFinalGrade } from "../../utils/calculateFinalGrade";
import FinalGradeCell from "./FinalGradeCell";
import GradeActionBar from "./GradeActionBar";
import GradeInputCell from "./GradeInputCell";
import GradeStudentCell from "./GradeStudentCell";
import GradeTableHeader from "./GradeTableHeader";
import GradeReadOnlyStatus from "./GradeReadOnlyStatus";

export default function GradeTable({
  students,
  components,
  grades,
  errors,
  kkm,
  isEditing,
  isSaving,
  isDirty,
  autosaveStatus,
  locked,
  sortDirection,
  onSort,
  onGradeChange,
  onEdit,
  onCancel,
  onSave,
  onOpenTopics,
  topicButtonRef,
  readOnly = false,
  finalGrades = null,
}) {
  return (
    <section id="grade-table-section" className="mt-8 overflow-hidden rounded-2xl bg-white shadow-soft">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <GradeTableHeader components={components} sortDirection={sortDirection} onSort={onSort} />
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="group border-t border-[#E9ECF2] hover:bg-[#FBFCFE]">
                <GradeStudentCell student={student} />
                {components.map((component) => {
                  const value = grades?.[student.id]?.[component.id];
                  const error = errors?.[`${student.id}:${component.id}`];
                  return isEditing ? (
                    <GradeInputCell
                      key={component.id}
                      student={student}
                      component={component}
                      value={value}
                      error={error}
                      disabled={isSaving || locked}
                      onChange={(nextValue) => onGradeChange(student.id, component.id, nextValue)}
                    />
                  ) : (
                    <td key={component.id} className="px-2 py-4 text-center text-sm text-[#20232D]">
                      {value === null || value === undefined || value === "" ? "—" : value}
                    </td>
                  );
                })}
                <FinalGradeCell
                  value={finalGrades && Object.prototype.hasOwnProperty.call(finalGrades, student.id)
                    ? finalGrades[student.id]
                    : calculateFinalGrade(grades?.[student.id], components)}
                  kkm={kkm}
                  showStatusLabel={!readOnly}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {readOnly ? <GradeReadOnlyStatus /> : <GradeActionBar
        isEditing={isEditing}
        isSaving={isSaving}
        isDirty={isDirty}
        autosaveStatus={autosaveStatus}
        locked={locked}
        onEdit={onEdit}
        onCancel={onCancel}
        onSave={onSave}
        onOpenTopics={onOpenTopics}
        topicButtonRef={topicButtonRef}
      />}
    </section>
  );
}
