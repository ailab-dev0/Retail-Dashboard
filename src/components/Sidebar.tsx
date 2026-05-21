import React from "react";
import { 
  LayoutDashboard, 
  CheckSquare, 
  MessageSquare, 
  Users, 
  Calendar, 
  UserCheck, 
  FileText, 
  Settings 
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  activeTab: "overview" | "approvals" | "mentoring";
  setActiveTab: (tab: "overview" | "approvals" | "mentoring") => void;
  pendingCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  activeTab,
  setActiveTab,
  pendingCount,
}) => {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`} id="sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">AOS</div>
        <span className="sidebar-logo-text">Academic Ops Suite</span>
      </div>

      {/* Main Section */}
      <div className="sidebar-section-label">Main</div>
      
      <div 
        onClick={() => setActiveTab("overview")}
        className={`sidebar-item ${activeTab === "overview" ? "active" : ""}`}
      >
        <span className="sidebar-icon">
          <LayoutDashboard size={18} />
        </span>
        <span>Dashboard</span>
      </div>

      <div 
        onClick={() => setActiveTab("approvals")}
        className={`sidebar-item ${activeTab === "approvals" ? "active" : ""}`}
      >
        <span className="sidebar-icon">
          <CheckSquare size={18} />
        </span>
        <span>Approval Queue</span>
        {pendingCount > 0 && <span className="badge">{pendingCount}</span>}
      </div>

      <div className="sidebar-item hover:opacity-80">
        <span className="sidebar-icon">
          <MessageSquare size={18} />
        </span>
        <span>Forum Updates</span>
      </div>

      <div 
        onClick={() => setActiveTab("mentoring")}
        className={`sidebar-item ${activeTab === "mentoring" ? "active" : ""}`}
      >
        <span className="sidebar-icon">
          <Users size={18} />
        </span>
        <span>Mentoring Hub</span>
      </div>

      {/* Manage Section */}
      <div className="sidebar-section-label">Manage</div>
      
      <div className="sidebar-item hover:opacity-80">
        <span className="sidebar-icon">
          <Calendar size={18} />
        </span>
        <span>Batch Schedule</span>
      </div>

      <div className="sidebar-item hover:opacity-80">
        <span className="sidebar-icon">
          <UserCheck size={18} />
        </span>
        <span>Faculty Operations</span>
      </div>

      <div className="sidebar-item hover:opacity-80">
        <span className="sidebar-icon">
          <FileText size={18} />
        </span>
        <span>Executive Reports</span>
      </div>

      {/* System Section */}
      <div className="sidebar-section-label">System</div>
      
      <div className="sidebar-item hover:opacity-80">
        <span className="sidebar-icon">
          <Settings size={18} />
        </span>
        <span>Global Settings</span>
      </div>
    </aside>
  );
};
