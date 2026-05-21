import { useMemo } from "react";
import { MessageSquare, Filter, Calendar, CheckCircle, XCircle, ChevronDown, Check, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ForumPage() {
  const { entries, handleApprove, handleDisapprove, showToast } = useApp();
  const forumEntries = useMemo(() => entries.filter((e) => e.category === "Forum"), [entries]);

  const groupedByDate = useMemo(() => forumEntries.reduce((acc, entry) => {
    const key = entry.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {} as Record<string, typeof forumEntries>), [forumEntries]);

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const getAvatarColor = (name: string) => {
    const colors = ["#2563EB", "#7C3AED", "#0D9488", "#D97706", "#DC2626", "#059669", "#4F46E5"];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const getStatusColor = (status: string) => {
    if (status === "Approved") return { bg: "#ECFDF5", color: "#059669", border: "#10B981", dot: "#10B981" };
    if (status === "Disapproved") return { bg: "#FEF2F2", color: "#DC2626", border: "#EF4444", dot: "#EF4444" };
    return { bg: "#FFF7ED", color: "#C2410C", border: "#F97316", dot: "#F97316" };
  };

  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <div className="page-body">
      {/* LEFT RAIL */}
      <div className="rail">
        {/* Quick Filters */}
        <div className="rail-card">
          <div className="rail-card-header">
            <div className="rail-card-title"><Filter size={14} />Quick Filters</div>
          </div>
          <div className="rail-card-body" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {["All Status", "Approved", "Pending", "Disapproved"].map((filter) => (
              <button
                key={filter}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", textAlign: "left", fontSize: "12px", fontWeight: 400, background: "transparent", color: "#64748B", border: "none", cursor: "pointer", fontFamily: "inherit" }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="rail-card">
          <div className="rail-card-header">
            <div className="rail-card-title"><MessageSquare size={14} />Summary</div>
          </div>
          <div className="rail-card-body" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#64748B" }}>Total Entries</span>
              <span style={{ fontSize: "20px", fontWeight: 700, color: "#2563EB" }}>{forumEntries.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#64748B" }}>Approved</span>
              <span style={{ fontSize: "20px", fontWeight: 700, color: "#10B981" }}>{forumEntries.filter((e) => e.approvalStatus === "Approved").length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#64748B" }}>Pending</span>
              <span style={{ fontSize: "20px", fontWeight: 700, color: "#F97316" }}>{forumEntries.filter((e) => e.approvalStatus === "Pending").length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#64748B" }}>Disapproved</span>
              <span style={{ fontSize: "20px", fontWeight: 700, color: "#DC2626" }}>{forumEntries.filter((e) => e.approvalStatus === "Disapproved").length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT MAIN AREA */}
      <div className="main-area">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MessageSquare size={20} style={{ color: "#F97316" }} />
            </div>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", margin: 0 }}>Forum Updates</h2>
              <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>Track all forum updates, approvals, and decisions</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, background: "#F8FAFC", color: "#64748B", padding: "4px 10px", borderRadius: "6px", border: "1px solid #E2E8F0" }}>{forumEntries.length} entries</span>
            <button style={{ width: "34px", height: "34px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Filter size={14} style={{ color: "#64748B" }} />
            </button>
            <button style={{ width: "34px", height: "34px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Calendar size={14} style={{ color: "#64748B" }} />
            </button>
          </div>
        </div>

        {/* Timeline */}
        {forumEntries.length === 0 ? (
          <div className="chart-card">
            <div className="chart-body" style={{ textAlign: "center", padding: "48px 16px" }}>
              <MessageSquare size={40} style={{ color: "#E2E8F0", margin: "0 auto 12px" }} />
              <p style={{ color: "#64748B", fontSize: "12px" }}>No forum updates recorded yet.</p>
            </div>
          </div>
        ) : (
          <div style={{ position: "relative" }}>
            {/* Timeline vertical line */}
            <div style={{ position: "absolute", left: "27px", top: "20px", bottom: "20px", width: "2px", background: "#E2E8F0", borderRadius: "1px" }} />

            {sortedDates.map((date) => (
              <div key={date} style={{ position: "relative", marginBottom: "24px" }}>
                {/* Date header */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", paddingLeft: "56px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981" }} />
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>{formatDateDisplay(date)}</span>
                  </div>
                </div>

                {/* Entries for this date */}
                {groupedByDate[date].map((entry) => {
                  const sc = getStatusColor(entry.approvalStatus);
                  return (
                    <div key={entry.trackingID} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                      {/* Timeline dot */}
                      <div style={{ width: "56px", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "4px", flexShrink: 0 }}>
                        <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: sc.dot, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {entry.approvalStatus === "Approved" ? (
                            <Check size={11} style={{ color: "white", strokeWidth: 3 }} />
                          ) : entry.approvalStatus === "Disapproved" ? (
                            <XCircle size={11} style={{ color: "white", strokeWidth: 3 }} />
                          ) : (
                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white" }} />
                          )}
                        </div>
                      </div>

                      {/* Card */}
                      <div style={{ flex: 1, background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden", borderLeft: `4px solid ${sc.border}` }}>
                        {/* Card body */}
                        <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: "14px" }}>
                          {/* Avatar */}
                          <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: getAvatarColor(entry.spocName), display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "13px", fontWeight: 700, flexShrink: 0 }}>
                            {getInitials(entry.spocName)}
                          </div>

                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                              <span style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>{entry.spocName}</span>
                              <span className="queue-id">AOS-{entry.trackingID}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "rgba(249,115,22,0.1)", color: "#F97316" }}>
                                {entry.subject.split(" - ")[0]}
                              </span>
                              <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "rgba(37,99,235,0.1)", color: "#2563EB" }}>
                                {entry.vertical.replace("Retail-", "")}
                              </span>
                              <span style={{ fontSize: "10px", color: "#94A3B8" }}>{entry.startTime} - {entry.endTime}</span>
                              <span style={{ fontSize: "10px", color: "#94A3B8" }}>·</span>
                              <span style={{ fontSize: "11px", fontWeight: 700, color: "#0F172A" }}>{entry.totalHoursDecimal}h</span>
                            </div>
                          </div>

                          {/* Status button */}
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                            <span style={{ fontSize: "11px", fontWeight: 700, padding: "5px 10px", borderRadius: "6px", background: sc.bg, color: sc.color, display: "flex", alignItems: "center", gap: "4px" }}>
                              {entry.approvalStatus === "Approved" ? (
                                <CheckCircle size={12} />
                              ) : entry.approvalStatus === "Disapproved" ? (
                                <XCircle size={12} />
                              ) : (
                                <Clock size={12} />
                              )}
                              {entry.approvalStatus}
                            </span>
                            <button style={{ width: "24px", height: "24px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                              <ChevronDown size={12} style={{ color: "#94A3B8" }} />
                            </button>
                          </div>
                        </div>

                        {/* Pending action bar */}
                        {entry.approvalStatus === "Pending" && (
                          <div style={{ padding: "8px 16px", borderTop: "1px solid #F1F5F9", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                            <button
                              onClick={() => { handleDisapprove(entry.trackingID); showToast(`Returned ${entry.spocName}`); }}
                              style={{ padding: "5px 12px", background: "white", border: "1px solid #E2E8F0", borderRadius: "6px", fontSize: "11px", fontWeight: 600, color: "#64748B", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "4px" }}
                            >
                              <XCircle size={12} style={{ color: "#EF4444" }} /> Return
                            </button>
                            <button
                              onClick={() => { handleApprove(entry.trackingID); showToast(`Approved ${entry.spocName}`); }}
                              style={{ padding: "5px 12px", background: "#10B981", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: 600, color: "white", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "4px" }}
                            >
                              <Check size={12} /> Authorize
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}