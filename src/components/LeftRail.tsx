import React from "react";
import { AlertCircle, History, ArrowRight } from "lucide-react";
import type { TrackingEntry } from "../data/mockData";

interface LeftRailProps {
  entries: TrackingEntry[];
  onOpenApprovalQueue: () => void;
}

export const LeftRail: React.FC<LeftRailProps> = ({ entries, onOpenApprovalQueue }) => {
  // Derive category counts for pending approval items
  const pendingEntries = entries.filter((e) => e.approvalStatus === "Pending");
  const pendingCount = pendingEntries.length;

  let f2f = 0;
  let online = 0;
  let mentoring = 0;
  let forumOrOther = 0;

  pendingEntries.forEach((e) => {
    if (e.category === "Face to Face class") f2f++;
    else if (e.category === "Online class") online++;
    else if (e.category === "Mentoring") mentoring++;
    else forumOrOther++;
  });

  // Take the 5 most recent entries for the Activity Timeline
  const recentActivity = [...entries].slice(0, 5);

  const getCategoryDotColor = (cat: string) => {
    if (cat === "Face to Face class") return "var(--color-cyan)";
    if (cat === "Online class") return "var(--color-purple)";
    if (cat === "Mentoring") return "#CA8A04";
    return "var(--color-warning)";
  };

  const getRelativeTime = (idx: number) => {
    if (idx === 0) return "10 min ago";
    if (idx === 1) return "42 min ago";
    if (idx === 2) return "Yesterday 4:30 PM";
    if (idx === 3) return "Yesterday 3:15 PM";
    return "8 May 2026";
  };

  return (
    <div className="rail">
      {/* Needs Attention Card */}
      <div className="rail-card action-card">
        <div className="rail-card-header">
          <div className="rail-card-title">
            <AlertCircle size={14} className="text-[#C2410C]" />
            Needs Your Attention
          </div>
          <span className="text-[10px] text-[#9A3412] font-bold tracking-wider">TODAY</span>
        </div>

        <div className="rail-card-body">
          <div className="action-count">{pendingCount}</div>
          <div className="action-label">Entries Pending Approval</div>
          
          <div className="action-trend up">
            ↑ +12 more than yesterday baseline
          </div>

          <div className="action-breakdown">
            <div className="action-row">
              <div className="name">
                <div className="dot" style={{ background: "var(--color-cyan)" }}></div>
                F2F
              </div>
              <div className="count">{f2f}</div>
            </div>

            <div className="action-row">
              <div className="name">
                <div className="dot" style={{ background: "var(--color-purple)" }}></div>
                Online
              </div>
              <div className="count">{online}</div>
            </div>

            <div className="action-row">
              <div className="name">
                <div className="dot" style={{ background: "var(--color-warning)" }}></div>
                Forum/Other
              </div>
              <div className="count">{forumOrOther}</div>
            </div>

            <div className="action-row">
              <div className="name">
                <div className="dot" style={{ background: "#CA8A04" }}></div>
                Mentoring
              </div>
              <div className="count">{mentoring}</div>
            </div>
          </div>

          <button className="action-btn" onClick={onOpenApprovalQueue}>
            Open Approval Queue
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Recent Activity Feed Card */}
      <div className="rail-card">
        <div className="rail-card-header">
          <div className="rail-card-title">
            <History size={14} />
            Recent Activity
          </div>
        </div>

        <div className="rail-card-body !px-4 !py-2">
          <div className="activity-list">
            {recentActivity.map((entry, i) => (
              <div key={entry.trackingID || i} className="activity-item">
                <div 
                  className="activity-dot" 
                  style={{ background: getCategoryDotColor(entry.category) }}
                />
                <div>
                  <div className="activity-text font-medium">
                    {entry.spocName} — {entry.category} ({entry.subject})
                  </div>
                  <div className="activity-time">
                    {entry.approvalStatus === "Approved" ? "✓ Authorized · " : "Pending · "}
                    {getRelativeTime(i)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
