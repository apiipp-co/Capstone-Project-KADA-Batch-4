import DashboardGreeting from "../../components/dashboard/DashboardGreeting";
import InsightCard from "../../components/dashboard/InsightCard";

export default function TeacherDashboardPage() {
  return (
    <div className="px-4 py-8 sm:px-7 sm:py-10 lg:px-10">
      <div className="mx-auto max-w-[880px]">
        <DashboardGreeting />
        <InsightCard />
      </div>
    </div>
  );
}
