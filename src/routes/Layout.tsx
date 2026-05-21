import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  MessageSquare,
  Users,
  Calendar,
  UserCheck,
  FileText,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/approvals", icon: CheckSquare, label: "Approval Queue", badge: true },
  { to: "/mentoring", icon: Users, label: "Mentoring Hub" },
  { to: "/forum", icon: MessageSquare, label: "Forum Updates" },
  { to: "/batch-schedule", icon: Calendar, label: "Batch Schedule" },
  { to: "/faculty", icon: UserCheck, label: "Faculty Operations" },
  { to: "/reports", icon: FileText, label: "Executive Reports" },
  { to: "/settings", icon: Settings, label: "Global Settings" },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const { pendingCount } = useApp();

  return (
    <div className="app font-['Fira_Sans']">
      <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">AOS</div>
          <span className="sidebar-logo-text">Academic Ops Suite</span>
        </div>

        <div className="sidebar-section-label">Main</div>
        {navItems.slice(0, 4).map(({ to, icon: Icon, label, exact, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) => `sidebar-item${isActive ? " active" : ""}`}
          >
            <span className="sidebar-icon">
              <Icon size={18} />
            </span>
            <span>{label}</span>
            {badge && pendingCount > 0 && <span className="badge">{pendingCount}</span>}
          </NavLink>
        ))}

        <div className="sidebar-section-label">Manage</div>
        {navItems.slice(4, 7).map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-item${isActive ? " active" : ""}`}
          >
            <span className="sidebar-icon">
              <Icon size={18} />
            </span>
            <span>{label}</span>
          </NavLink>
        ))}

        <div className="sidebar-section-label">System</div>
        <NavLink
          to="/settings"
          className={({ isActive }) => `sidebar-item${isActive ? " active" : ""}`}
        >
          <span className="sidebar-icon">
            <Settings size={18} />
          </span>
          <span>Global Settings</span>
        </NavLink>
      </aside>

      <div className={`main-wrapper${collapsed ? " shifted" : ""}`}>
        <header className="topbar">
          <div className="topbar-left">
            <button className="sidebar-toggle" onClick={() => setCollapsed((c) => !c)}>
              {collapsed ? <Menu size={18} /> : <X size={18} />}
            </button>
            <div className="topbar-title">Academic Ops Suite</div>
          </div>
          <div className="topbar-right">
            <div className="topbar-user">
              <div className="topbar-avatar">VB</div>
              <div>
                <div className="topbar-user-name">Vikram B</div>
                <div className="topbar-user-role">Retail Ops Lead</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}