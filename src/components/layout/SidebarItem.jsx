import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

export default function SidebarItem({ to, icon: Icon, label, collapsed, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          "group relative flex h-11 items-center rounded-[11px] text-sm font-semibold transition-colors",
          collapsed ? "mx-auto w-11 justify-center" : "mx-4 gap-3 px-4",
          isActive
            ? "bg-[#2F67ED] text-white shadow-sm"
            : "text-[#494E5D] hover:bg-[#EEF3FF] hover:text-[#20232D]",
        )
      }
    >
      <Icon aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={1.9} />
      {!collapsed && <span>{label}</span>}
      {collapsed && (
        <span className="pointer-events-none absolute left-[calc(100%+10px)] z-50 hidden whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white shadow-md group-hover:block group-focus-visible:block">
          {label}
        </span>
      )}
    </NavLink>
  );
}
