import { useMemo, useState } from "react";
import { Users, CheckCircle2, XCircle, AlertTriangle, ChevronDown } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function FacultyPage() {
  const { entries, handleApprove, handleDisapprove } = useApp();
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);

  const facultyStats = useMemo(() => {
    const map: Record<string, {
      entries: typeof entries;
      totalHours: number;
      approved: number;
      pending: number;
      disapproved: number;
      highRisk: number;
      avgScore: number;
    }> = {};

    entries.forEach((e) => {
      if (!map[e.spocName]) {
        map[e.spocName] = { entries: [], totalHours: 0, approved: 0, pending: 0, disapproved: 0, highRisk: 0, avgScore: 0 };
      }
      map[e.spocName].entries.push(e);
      map[e.spocName].totalHours += e.totalHoursDecimal;
      if (e.approvalStatus === "Approved") map[e.spocName].approved++;
      if (e.approvalStatus === "Pending") map[e.spocName].pending++;
      if (e.approvalStatus === "Disapproved") map[e.spocName].disapproved++;
      if (e.slaRisk === "high") map[e.spocName].highRisk++;
      map[e.spocName].avgScore += e.validationScore;
    });

    return Object.entries(map).map(([name, stats]) => ({
      name,
      ...stats,
      avgScore: stats.entries.length > 0 ? Math.round(stats.avgScore / stats.entries.length) : 0,
      approvalRate: stats.entries.length > 0 ? Math.round((stats.approved / stats.entries.length) * 100) : 0,
    })).sort((a, b) => b.entries.length - a.entries.length);
  }, [entries]);

  const selected = facultyStats.find((f) => f.name === selectedFaculty);

  const getCatClass = (cat: string) => {
    if (cat === "Face to Face class") return "pill-f2f";
    if (cat === "Online class") return "pill-online";
    if (cat === "Mentoring") return "pill-mentor";
    return "pill-forum";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { bg: "#ECFDF5", color: "#059669" };
    if (score >= 70) return { bg: "#FFF7ED", color: "#D97706" };
    return { bg: "#FEF2F2", color: "#DC2626" };
  };

  return (
    <div className="page-body">
      {/* Faculty list */}
      <div className="rail">
        {facultyStats.map((fac) => (
          <div key={fac.name} className="rail-card" style={{ cursor: "pointer" }} onClick={() => setSelectedFaculty(fac.name === selectedFaculty ? null : fac.name)}>
            <div style={{ padding: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563EB", fontSize: "11px", fontWeight: 700 }}>
                    {fac.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                  <span className="text-xs font-semibold" style={{ color: "#0F172A" }}>{fac.name}</span>
                </div>
                <ChevronDown size={14} style={{ color: "#94A3B8", transform: selectedFaculty === fac.name ? "rotate(180deg)" : "none", transition: "transform 150ms" }} />
              </div>
              <div className="text-[11px]" style={{ color: "#64748B", display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span>{fac.entries.length} entries</span>
                <span>·</span>
                <span style={{ color: "#059669", fontWeight: 600 }}>{fac.approvalRate}%</span>
                <span>·</span>
                <span style={{ fontWeight: 600 }}>{fac.totalHours.toFixed(1)}h</span>
              </div>
              <div style={{ height: "6px", background: "#F1F5F9", borderRadius: "3px", overflow: "hidden", display: "flex" }}>
                <div style={{ width: `${fac.approvalRate}%`, background: "#10B981", height: "100%" }}></div>
                <div style={{ width: `${(fac.pending / fac.entries.length) * 100}%`, background: "#F97316", height: "100%" }}></div>
                <div style={{ width: `${(fac.disapproved / fac.entries.length) * 100}%`, background: "#EF4444", height: "100%" }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Faculty detail */}
      <div className="main-area">
        {selected ? (
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title"><Users size={14} />{selected.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {(() => {
                  const badge = getScoreBadge(selected.avgScore);
                  return <span style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 700, background: badge.bg, color: badge.color }}>Score: {selected.avgScore}%</span>;
                })()}
                {selected.highRisk > 0 && (
                  <span style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 700, background: "#FEF2F2", color: "#DC2626", display: "flex", alignItems: "center", gap: "4px" }}>
                    <AlertTriangle size={10} /> {selected.highRisk} High Risk
                  </span>
                )}
              </div>
            </div>

            <div className="chart-body">
              <div className="week-stats">
                <div className="week-stat-row">
                  <div className="week-stat-label">Total Entries</div>
                  <div><span className="week-stat-value">{selected.entries.length}</span></div>
                </div>
                <div className="week-stat-row">
                  <div className="week-stat-label">Approved</div>
                  <div><span className="week-stat-value" style={{ color: "#059669" }}>{selected.approved}</span></div>
                </div>
                <div className="week-stat-row">
                  <div className="week-stat-label">Pending</div>
                  <div><span className="week-stat-value" style={{ color: "#D97706" }}>{selected.pending}</span></div>
                </div>
                <div className="week-stat-row">
                  <div className="week-stat-label">Total Hours</div>
                  <div><span className="week-stat-value">{selected.totalHours.toFixed(1)}h</span></div>
                </div>
              </div>
            </div>

            <div className="queue-table-wrap">
              <table className="queue-table">
                <thead>
                  <tr>
                    <th>Tracking ID</th>
                    <th>Subject</th>
                    <th>Category</th>
                    <th>Hours</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.entries.map((entry) => (
                    <tr key={entry.trackingID}>
                      <td className="queue-id">AOS-{entry.trackingID}</td>
                      <td style={{ fontWeight: 500, color: "#334155" }}>{entry.subject}</td>
                      <td><span className={`queue-cat-pill ${getCatClass(entry.category)}`}>{entry.category}</span></td>
                      <td style={{ fontWeight: 700, color: "#0F172A" }}>{entry.totalHoursDecimal}h</td>
                      <td>
                        <span className={`queue-status-pill ${
                          entry.approvalStatus === "Approved" ? "pill-approved" :
                          entry.approvalStatus === "Pending" ? "pill-pending" : "pill-rejected"
                        }`}>
                          {entry.approvalStatus}
                        </span>
                      </td>
                      <td>
                        {entry.approvalStatus === "Pending" && (
                          <div className="queue-actions">
                            <button onClick={() => handleApprove(entry.trackingID)} className="queue-action-btn approve">
                              <CheckCircle2 size={13} />
                            </button>
                            <button onClick={() => handleDisapprove(entry.trackingID)} className="queue-action-btn reject">
                              <XCircle size={13} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="chart-card">
            <div className="chart-body" style={{ textAlign: "center", padding: "48px 16px" }}>
              <Users size={40} style={{ color: "#E2E8F0", margin: "0 auto 12px" }} />
              <p className="text-xs" style={{ color: "#64748B" }}>Select a faculty member to view their details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}