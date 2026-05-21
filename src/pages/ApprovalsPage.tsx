import { useState, useMemo } from "react";
import { Search, CheckCircle, XCircle, Filter, UserCheck } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CreateEntryModal } from "../components/CreateEntryModal";

const SUBJECTS_LIST = ["FAR - Financial Accounting & Reporting", "REG - Regulation", "AUD - Auditing & Attestation", "CMA - Cost Accounting", "BEC - Business Environment"];
const FACULTY_LIST = ["Priya Sharma", "Anil Verma", "Meera Patel", "Rajesh Kumar", "Sunita Reddy"];

export default function ApprovalsPage() {
  const { entries, handleApprove, handleDisapprove, handleBulkApprove, handleAddEntry, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedVerticals, setSelectedVerticals] = useState<("CPA" | "CMA")[]>(["CPA", "CMA"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedFaculty, setSelectedFaculty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      if (e.approvalStatus !== "Pending") return false;
      if (dateFrom && e.date < dateFrom) return false;
      if (dateTo && e.date > dateTo) return false;
      if (!selectedVerticals.includes(e.vertical.replace("Retail-", "") as "CPA" | "CMA")) return false;
      if (selectedCategory !== "All" && e.category !== selectedCategory) return false;
      if (selectedSubject !== "All" && e.subject !== selectedSubject) return false;
      if (selectedFaculty !== "All" && e.spocName !== selectedFaculty) return false;
      if (searchQuery && !e.spocName.toLowerCase().includes(searchQuery.toLowerCase()) && !e.trackingID.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [entries, dateFrom, dateTo, selectedVerticals, selectedCategory, selectedSubject, selectedFaculty, searchQuery]);

  const pending = filteredEntries.filter((e) => e.approvalStatus === "Pending");
  const slaBreached = pending.filter((e) => e.slaRisk === "high");
  const escalations = pending.filter((e) => e.validationScore < 70);
  const avgTime = pending.length > 0 ? Math.round(pending.reduce((s, e) => s + e.totalHoursDecimal, 0) / pending.length * 10) / 10 : 0;

  const toggleVertical = (v: "CPA" | "CMA") => {
    if (selectedVerticals.includes(v)) {
      if (selectedVerticals.length > 1) setSelectedVerticals(selectedVerticals.filter((x) => x !== v));
    } else {
      setSelectedVerticals([...selectedVerticals, v]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === pending.length) setSelectedIds([]);
    else setSelectedIds(pending.map((e) => e.trackingID));
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  };

  const handleBulkAuthorize = () => {
    if (selectedIds.length > 0) {
      handleBulkApprove(selectedIds);
      showToast(`Authorized ${selectedIds.length} entries`);
      setSelectedIds([]);
    }
  };

  const getCatClass = (cat: string) => {
    if (cat === "Face to Face class") return { bg: "rgba(6,182,212,0.1)", color: "#06B6D4" };
    if (cat === "Online class") return { bg: "rgba(139,92,246,0.1)", color: "#8B5CF6" };
    if (cat === "Mentoring") return { bg: "rgba(234,179,8,0.1)", color: "#CA8A04" };
    return { bg: "rgba(249,115,22,0.1)", color: "#F97316" };
  };

  const getRiskBorder = (risk: string) => {
    if (risk === "high") return "#DC2626";
    if (risk === "medium") return "#D97706";
    return "#059669";
  };

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  const categories = ["All", "Face to Face class", "Online class", "Forum", "Mentoring"];

  return (
    <div className="page-body">
      {/* LEFT RAIL — Filter Panel */}
      <div className="rail">
        <div className="rail-card">
          <div className="rail-card-header">
            <div className="rail-card-title"><Filter size={14} />Filter Queue</div>
          </div>
          <div className="rail-card-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Search */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#F8FAFC", padding: "8px 12px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
              <Search size={13} style={{ color: "#64748B", flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search faculty or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: "none", background: "transparent", outline: "none", fontSize: "12px", fontFamily: "inherit", width: "100%", color: "#0F172A" }}
              />
            </div>

            {/* Date Range */}
            <div>
              <div style={{ fontSize: "10px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Date Interval</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ flex: 1, padding: "6px 8px", borderRadius: "6px", border: "1px solid #E2E8F0", fontSize: "11px", fontFamily: "inherit", background: "#F8FAFC", color: "#0F172A", outline: "none" }} />
                <span style={{ color: "#94A3B8", fontSize: "11px" }}>to</span>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={{ flex: 1, padding: "6px 8px", borderRadius: "6px", border: "1px solid #E2E8F0", fontSize: "11px", fontFamily: "inherit", background: "#F8FAFC", color: "#0F172A", outline: "none" }} />
              </div>
            </div>

            {/* Verticals */}
            <div>
              <div style={{ fontSize: "10px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Vertical</div>
              <div style={{ display: "flex", gap: "6px" }}>
                {(["CPA", "CMA"] as const).map((v) => {
                  const active = selectedVerticals.includes(v);
                  return (
                    <button
                      key={v}
                      onClick={() => toggleVertical(v)}
                      style={{ flex: 1, padding: "6px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, border: "none", cursor: "pointer", transition: "all 150ms", background: active ? (v === "CPA" ? "#4F46E5" : "#0D9488") : "#F1F5F9", color: active ? "white" : "#64748B" }}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Segmented */}
            <div>
              <div style={{ fontSize: "10px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Category</div>
              <div className="segmented-control" style={{ flexWrap: "wrap", gap: "4px", padding: "4px", background: "#F1F5F9", borderRadius: "8px", display: "flex" }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`segment-btn ${selectedCategory === cat ? "active" : ""}`}
                    style={{ padding: "5px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 600, cursor: "pointer", border: "none", transition: "all 150ms", background: selectedCategory === cat ? "white" : "transparent", color: selectedCategory === cat ? "#2563EB" : "#64748B", boxShadow: selectedCategory === cat ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}
                  >
                    {cat === "All" ? "All" : cat.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <div style={{ fontSize: "10px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Subject</div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2E8F0", fontSize: "11px", fontFamily: "inherit", background: "#F8FAFC", color: "#0F172A", outline: "none", cursor: "pointer" }}
              >
                <option value="All">All Subjects</option>
                {SUBJECTS_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Faculty */}
            <div>
              <div style={{ fontSize: "10px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Faculty</div>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2E8F0", fontSize: "11px", fontFamily: "inherit", background: "#F8FAFC", color: "#0F172A", outline: "none", cursor: "pointer" }}
              >
                <option value="All">All Faculty</option>
                {FACULTY_LIST.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>

              </div>

      {/* RIGHT — Content Area */}
      <div className="main-area">
        {/* KPI Cards Row - Compact */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          <div className="chart-card compact" style={{ borderTop: "3px solid #10B981" }}>
            <div className="chart-header"><div className="chart-title"><div className="dot" style={{ background: "#10B981" }}></div>Pending</div></div>
            <div className="chart-body">
              <div className="chart-kpi-value" style={{ color: "#10B981" }}>{pending.length}</div>
              <div className="chart-kpi-label">Entries awaiting review</div>
            </div>
          </div>

          <div className="chart-card compact" style={{ borderTop: "3px solid #DC2626" }}>
            <div className="chart-header"><div className="chart-title"><div className="dot" style={{ background: "#DC2626" }}></div>SLA Breached</div></div>
            <div className="chart-body">
              <div className="chart-kpi-value" style={{ color: "#DC2626" }}>{slaBreached.length}</div>
              <div className="chart-kpi-label">Over 24h threshold</div>
            </div>
          </div>

          <div className="chart-card compact" style={{ borderTop: "3px solid #F97316" }}>
            <div className="chart-header"><div className="chart-title"><div className="dot" style={{ background: "#F97316" }}></div>Escalations</div></div>
            <div className="chart-body">
              <div className="chart-kpi-value" style={{ color: "#F97316" }}>{escalations.length}</div>
              <div className="chart-kpi-label">Low validation score</div>
            </div>
          </div>

          <div className="chart-card compact" style={{ borderTop: "3px solid #3B82F6" }}>
            <div className="chart-header"><div className="chart-title"><div className="dot" style={{ background: "#3B82F6" }}></div>Avg Time</div></div>
            <div className="chart-body">
              <div className="chart-kpi-value" style={{ color: "#3B82F6" }}>{avgTime}h</div>
              <div className="chart-kpi-label">Average session length</div>
            </div>
          </div>
        </div>


        {/* Queue Table Card */}
        <div className="chart-card primary">
          <div className="chart-header">
            <div className="chart-title"><UserCheck size={14} />Approval Queue</div>
            <span style={{ fontSize: "10px", fontWeight: 700, background: "#DC2626", color: "white", padding: "2px 8px", borderRadius: "10px" }}>{pending.length}</span>
          </div>
          <div className="queue-table-wrap">
            <table className="queue-table">
              <thead>
                <tr>
                  <th style={{ width: "40px" }}>
                    <input type="checkbox" checked={selectedIds.length > 0 && selectedIds.length === pending.length} onChange={toggleSelectAll} style={{ accentColor: "#2563EB", cursor: "pointer" }} />
                  </th>
                  <th>SPOC / Employee</th>
                  <th>Scope Context</th>
                  <th>Interval</th>
                  <th>Validation Score</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "#64748B", fontSize: "12px" }}>No entries match the current filter criteria.</td></tr>
                ) : (
                  pending.map((entry) => (
                    <tr key={entry.trackingID} style={{ borderLeft: `4px solid ${getRiskBorder(entry.slaRisk)}` }}>
                      <td>
                        <input type="checkbox" checked={selectedIds.includes(entry.trackingID)} onChange={() => toggleSelectOne(entry.trackingID)} style={{ accentColor: "#2563EB", cursor: "pointer" }} />
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #2563EB, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>
                            {getInitials(entry.spocName)}
                          </div>
                          <div>
                            <div style={{ fontSize: "12px", fontWeight: 600, color: "#0F172A" }}>{entry.spocName}</div>
                            <div className="queue-id">AOS-{entry.trackingID}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ fontSize: "12px", fontWeight: 600, color: "#0F172A" }}>{entry.subject}</span>
                            <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: entry.vertical === "Retail-CPA" ? "rgba(79,70,229,0.1)" : "rgba(13,148,136,0.1)", color: entry.vertical === "Retail-CPA" ? "#4F46E5" : "#0D9488" }}>
                              {entry.vertical.replace("Retail-", "")}
                            </span>
                          </div>
                          <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 6px", borderRadius: "4px", display: "inline-block", background: getCatClass(entry.category).bg, color: getCatClass(entry.category).color }}>
                            {entry.category}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A" }}>{entry.totalHoursDecimal}h</span>
                          <span style={{ fontSize: "10px", color: "#64748B" }}>{entry.date} · {entry.startTime}-{entry.endTime}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#0F172A" }}>{entry.validationScore}%</span>
                            <div style={{ width: "48px", height: "4px", background: "#E2E8F0", borderRadius: "2px", overflow: "hidden" }}>
                              <div style={{ width: `${entry.validationScore}%`, height: "100%", background: entry.validationScore >= 90 ? "#10B981" : entry.validationScore >= 70 ? "#F59E0B" : "#EF4444" }}></div>
                            </div>
                          </div>
                          <span style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", color: entry.slaRisk === "high" ? "#DC2626" : entry.slaRisk === "medium" ? "#D97706" : "#059669" }}>
                            {entry.slaRisk} risk
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="queue-actions">
                          <button onClick={() => { handleApprove(entry.trackingID); showToast(`Authorized ${entry.spocName}`); }} className="queue-action-btn approve" title="Authorize">
                            <CheckCircle size={14} />
                          </button>
                          <button onClick={() => { handleDisapprove(entry.trackingID); showToast(`Returned ${entry.spocName}`); }} className="queue-action-btn reject" title="Return">
                            <XCircle size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {selectedIds.length > 0 && (
            <div style={{ padding: "12px 16px", borderTop: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#EFF6FF" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#1D4ED8" }}>{selectedIds.length} selected</span>
              <button onClick={handleBulkAuthorize} style={{ padding: "6px 14px", background: "#10B981", color: "white", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle size={12} /> Authorize All
              </button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && <CreateEntryModal onClose={() => setIsModalOpen(false)} onSubmit={handleAddEntry} />}
    </div>
  );
}