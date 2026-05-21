import React, { useState } from "react";
import { 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  BookOpen, 
  ArrowRight, 
  Check, 
  X 
} from "lucide-react";
import type { TrackingEntry } from "../data/mockData";

interface MainMetricsAreaProps {
  entries: TrackingEntry[];
  onApprove: (id: string) => void;
  onDisapprove: (id: string) => void;
  onViewAllClick: () => void;
}

export const MainMetricsArea: React.FC<MainMetricsAreaProps> = ({
  entries,
  onApprove,
  onDisapprove,
  onViewAllClick,
}) => {
  const [tableTab, setTableTab] = useState<"pending" | "review" | "approved">("pending");

  // Derive global metrics
  const total = entries.length;
  const approved = entries.filter((e) => e.approvalStatus === "Approved");
  const pending = entries.filter((e) => e.approvalStatus === "Pending");
  const rejected = entries.filter((e) => e.approvalStatus === "Disapproved");

  const approvedCount = approved.length;
  const pendingCount = pending.length;
  const rejectedCount = rejected.length;

  const approvalRate = total > 0 ? Math.round((approvedCount / total) * 100) : 0;
  const dashOffset = Math.round(220 - (approvalRate / 100) * 220);

  // Derive categories breakdown
  const getCategoryMetrics = (cat: string) => {
    const subset = entries.filter((e) => e.category === cat);
    const subTotal = subset.length;
    const subApp = subset.filter((e) => e.approvalStatus === "Approved").length;
    const subPen = subset.filter((e) => e.approvalStatus === "Pending").length;
    const subRej = subset.filter((e) => e.approvalStatus === "Disapproved").length;

    const pct = total > 0 ? Math.round((subTotal / total) * 100) : 0;
    const appPct = subTotal > 0 ? Math.round((subApp / subTotal) * 100) : 0;
    const penPct = subTotal > 0 ? Math.round((subPen / subTotal) * 100) : 0;
    const rejPct = subTotal > 0 ? Math.round((subRej / subTotal) * 100) : 0;

    return { subTotal, pct, appPct, penPct, rejPct };
  };

  const f2fMetrics = getCategoryMetrics("Face to Face class");
  const onlineMetrics = getCategoryMetrics("Online class");
  const forumMetrics = getCategoryMetrics("Forum");
  const mentorMetrics = getCategoryMetrics("Mentoring");

  // Derive unique faculty count
  const uniqueFaculty = new Set(entries.map((e) => e.spocName)).size;

  // Derive records shown in the bottom table based on tab selected
  const displayedTableEntries = entries.filter((e) => {
    if (tableTab === "pending") return e.approvalStatus === "Pending";
    if (tableTab === "review") return e.approvalStatus === "Pending" && e.slaRisk === "high";
    if (tableTab === "approved") return e.approvalStatus === "Approved";
    return true;
  });

  const getPillClass = (cat: string) => {
    if (cat === "Face to Face class") return "pill-f2f";
    if (cat === "Online class") return "pill-online";
    if (cat === "Mentoring") return "pill-mentor";
    return "pill-forum";
  };

  return (
    <div className="main-area">
      {/* Top side-by-side row */}
      <div className="charts-row">
        {/* Approval Rate Card */}
        <div className="chart-card primary">
          <div className="chart-header">
            <div className="chart-title">
              <CheckCircle2 size={14} className="text-[#10B981]" />
              Approval Rate
            </div>
            <span className="text-[10px] text-[#10B981] font-bold">+2.4%</span>
          </div>

          <div className="chart-body">
            <div className="rate-gauge-wrap">
              <div className="gauge-svg-wrap">
                <svg viewBox="0 0 200 110" preserveAspectRatio="xMidYMid meet">
                  <path className="gauge-track" d="M20 90 A 70 70 0 0 1 180 90" />
                  <path 
                    className="gauge-fill" 
                    d="M20 90 A 70 70 0 0 1 180 90" 
                    strokeDasharray="220" 
                    strokeDashoffset={dashOffset} 
                  />
                  <text x="100" y="78" textAnchor="middle" className="gauge-value">
                    {approvalRate}%
                  </text>
                  <text x="100" y="94" textAnchor="middle" className="gauge-label-text">
                    Overall Rate
                  </text>
                </svg>
              </div>

              <div className="rate-stats">
                <div className="rate-stat">
                  <div className="rate-stat-val green">{approvedCount}</div>
                  <div className="rate-stat-label">Approved</div>
                </div>
                <div className="rate-stat">
                  <div className="rate-stat-val orange">{pendingCount}</div>
                  <div className="rate-stat-label">Pending</div>
                </div>
                <div className="rate-stat">
                  <div className="rate-stat-val red">{rejectedCount}</div>
                  <div className="rate-stat-label">Rejected</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* This Week Card */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <Clock size={14} className="text-[#3B82F6]" />
              This Week Summary
            </div>
          </div>

          <div className="chart-body">
            <div className="week-stats">
              <div className="week-stat-row">
                <div className="week-stat-label">
                  <BookOpen size={14} /> Entries Added
                </div>
                <div>
                  <span className="week-stat-value">{total}</span>
                  <span className="week-stat-delta up">+12%</span>
                </div>
              </div>

              <div className="week-stat-row">
                <div className="week-stat-label">
                  <CheckCircle2 size={14} /> Authorized
                </div>
                <div>
                  <span className="week-stat-value">{approvedCount}</span>
                  <span className="week-stat-delta up">+8%</span>
                </div>
              </div>

              <div className="week-stat-row">
                <div className="week-stat-label">
                  <Clock size={14} /> Avg. Review Time
                </div>
                <div>
                  <span className="week-stat-value">1.4d</span>
                  <span className="week-stat-delta down">-0.3d</span>
                </div>
              </div>

              <div className="week-stat-row">
                <div className="week-stat-label">
                  <UserCheck size={14} /> Active Faculty
                </div>
                <div>
                  <span className="week-stat-value">{uniqueFaculty}</span>
                  <span className="week-stat-delta up">+3 new</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full width Category Breakdown Card */}
      <div className="chart-card primary">
        <div className="chart-header">
          <div className="chart-title">
            <div className="dot green"></div> Category Breakdown
          </div>
          <div className="chart-link" onClick={onViewAllClick}>Drill down →</div>
        </div>

        <div className="chart-body">
          <div className="cat-rows">
            {/* F2F Row */}
            <div className="cat-row">
              <div className="cat-icon f2f">
                <BookOpen size={16} />
              </div>
              <div className="cat-info">
                <div className="cat-name-row">
                  <div className="cat-name">Face-to-Face</div>
                  <div className="cat-nums">
                    {f2fMetrics.subTotal} entries · {f2fMetrics.pct}%
                  </div>
                </div>
                <div className="cat-bar-track">
                  <div className="cat-bar-seg approved" style={{ width: `${f2fMetrics.appPct}%` }}></div>
                  <div className="cat-bar-seg pending" style={{ width: `${f2fMetrics.penPct}%` }}></div>
                  <div className="cat-bar-seg rejected" style={{ width: `${f2fMetrics.rejPct}%` }}></div>
                </div>
              </div>
            </div>

            {/* Online Row */}
            <div className="cat-row">
              <div className="cat-icon online">
                <Clock size={16} />
              </div>
              <div className="cat-info">
                <div className="cat-name-row">
                  <div className="cat-name">Online</div>
                  <div className="cat-nums">
                    {onlineMetrics.subTotal} entries · {onlineMetrics.pct}%
                  </div>
                </div>
                <div className="cat-bar-track">
                  <div className="cat-bar-seg approved" style={{ width: `${onlineMetrics.appPct}%` }}></div>
                  <div className="cat-bar-seg pending" style={{ width: `${onlineMetrics.penPct}%` }}></div>
                  <div className="cat-bar-seg rejected" style={{ width: `${onlineMetrics.rejPct}%` }}></div>
                </div>
              </div>
            </div>

            {/* Forum Row */}
            <div className="cat-row">
              <div className="cat-icon forum">
                <CheckCircle2 size={16} />
              </div>
              <div className="cat-info">
                <div className="cat-name-row">
                  <div className="cat-name">Forum Updates</div>
                  <div className="cat-nums">
                    {forumMetrics.subTotal} entries · {forumMetrics.pct}%
                  </div>
                </div>
                <div className="cat-bar-track">
                  <div className="cat-bar-seg approved" style={{ width: `${forumMetrics.appPct}%` }}></div>
                  <div className="cat-bar-seg pending" style={{ width: `${forumMetrics.penPct}%` }}></div>
                  <div className="cat-bar-seg rejected" style={{ width: `${forumMetrics.rejPct}%` }}></div>
                </div>
              </div>
            </div>

            {/* Mentoring Row */}
            <div className="cat-row">
              <div className="cat-icon mentor">
                <UserCheck size={16} />
              </div>
              <div className="cat-info">
                <div className="cat-name-row">
                  <div className="cat-name">Mentoring Operations</div>
                  <div className="cat-nums">
                    {mentorMetrics.subTotal} entries · {mentorMetrics.pct}%
                  </div>
                </div>
                <div className="cat-bar-track">
                  <div className="cat-bar-seg approved" style={{ width: `${mentorMetrics.appPct}%` }}></div>
                  <div className="cat-bar-seg pending" style={{ width: `${mentorMetrics.penPct}%` }}></div>
                  <div className="cat-bar-seg rejected" style={{ width: `${mentorMetrics.rejPct}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Table Approval Queue View Card */}
      <div className="queue-card">
        <div className="queue-header">
          <div className="queue-title">
            <div className="dot orange"></div>
            Pending Approval Queue Workspace
            <span className="badge">{displayedTableEntries.length}</span>
          </div>

          <div className="queue-tabs">
            <button
              className={`queue-tab ${tableTab === "pending" ? "active" : ""}`}
              onClick={() => setTableTab("pending")}
            >
              Pending ({pendingCount})
            </button>
            <button
              className={`queue-tab ${tableTab === "review" ? "active" : ""}`}
              onClick={() => setTableTab("review")}
            >
              In Review ({pending.filter((e) => e.slaRisk === "high").length})
            </button>
            <button
              className={`queue-tab ${tableTab === "approved" ? "active" : ""}`}
              onClick={() => setTableTab("approved")}
            >
              Authorized ({approvedCount})
            </button>
          </div>
        </div>

        <div className="queue-table-wrap">
          <table className="queue-table">
            <thead>
              <tr>
                <th>Entry ID</th>
                <th>Faculty</th>
                <th>Category</th>
                <th>Subject</th>
                <th>Hours</th>
                <th>Submitted Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedTableEntries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-slate-400 italic">
                    No active entries matching this route scope.
                  </td>
                </tr>
              ) : (
                displayedTableEntries.map((item) => (
                  <tr key={item.trackingID}>
                    <td className="queue-id">AOS-{item.trackingID}</td>
                    <td className="queue-name font-semibold">{item.spocName}</td>
                    <td>
                      <span className={`queue-cat-pill ${getPillClass(item.category)}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="font-medium text-slate-700">{item.subject}</td>
                    <td className="font-bold text-slate-900">{item.totalHoursDecimal}h</td>
                    <td>{item.date}</td>
                    <td>
                      {item.approvalStatus === "Approved" && (
                        <span className="queue-status-pill pill-approved">Approved</span>
                      )}
                      {item.approvalStatus === "Pending" && (
                        <span className="queue-status-pill pill-pending">Pending</span>
                      )}
                      {item.approvalStatus === "Disapproved" && (
                        <span className="queue-status-pill pill-rejected">Rejected</span>
                      )}
                    </td>
                    <td>
                      <div className="queue-actions">
                        {item.approvalStatus === "Pending" ? (
                          <>
                            <button
                              className="queue-action-btn approve"
                              title="Instantly Approve"
                              onClick={(e) => {
                                e.stopPropagation();
                                onApprove(item.trackingID);
                              }}
                            >
                              <Check size={13} />
                            </button>
                            <button
                              className="queue-action-btn reject"
                              title="Disapprove / Return"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDisapprove(item.trackingID);
                              }}
                            >
                              <X size={13} />
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic font-semibold">
                            Processed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="queue-viewall" onClick={onViewAllClick}>
          View all scoped workspace entries ({entries.length}) <ArrowRight size={13} className="inline ml-1" />
        </div>
      </div>
    </div>
  );
};
