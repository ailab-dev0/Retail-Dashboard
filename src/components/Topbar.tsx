import React from "react";
import { Menu, Search, Bell, Plus } from "lucide-react";

interface TopbarProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onCreateEntryClick: () => void;
  pendingCount: number;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleSidebar,
  searchQuery,
  setSearchQuery,
  onCreateEntryClick,
  pendingCount,
}) => {
  return (
    <header className="topbar">
      {/* Topbar Left Side */}
      <div className="topbar-left">
        <button 
          className="sidebar-toggle" 
          onClick={onToggleSidebar} 
          title="Toggle sidebar navigation"
        >
          <Menu size={18} />
        </button>
        <div className="topbar-title font-['Outfit']">Operations Dashboard</div>
        <div className="topbar-vertical-badge">Retail — CPA / CMA</div>
      </div>

      {/* Topbar Right Side */}
      <div className="topbar-right">
        <div className="topbar-search">
          <Search size={14} />
          <input 
            type="text" 
            placeholder="Search entries, faculty, subjects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className="topbar-btn" title="Notifications">
          <Bell size={16} />
          {pendingCount > 0 && <span className="badge">{pendingCount}</span>}
        </button>

        <button className="topbar-create-btn" onClick={onCreateEntryClick}>
          <Plus size={14} className="stroke-[2.5]" />
          Create Entry
        </button>

        <div className="topbar-user font-['Inter']">
          <div className="topbar-avatar">VB</div>
          <div className="text-left">
            <div className="topbar-user-name">Vikram B</div>
            <div className="topbar-user-role">Retail Ops Lead</div>
          </div>
        </div>
      </div>
    </header>
  );
};
