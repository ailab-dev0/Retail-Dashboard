import React, { useState } from "react";
import type { TrackingEntry } from "../data/mockData";
import { FACULTY_LIST, SUBJECTS_LIST } from "../data/mockData";
import { CheckSquare, Sparkles, CalendarPlus, Clock, BookOpen, Users } from "lucide-react";

interface MentoringViewProps {
  entries: TrackingEntry[];
  onAddSlot: (newEntry: TrackingEntry) => void;
}

export const MentoringGamePlanView: React.FC<MentoringViewProps> = ({ entries, onAddSlot }) => {
  const [slotType, setSlotType] = useState<"Mentoring" | "Game Plan">("Mentoring");
  const [faculty, setFaculty] = useState<string>(FACULTY_LIST[0]);
  const [vertical, setVertical] = useState<"Retail-CPA" | "Retail-CMA">("Retail-CPA");
  const [subject, setSubject] = useState<string>(SUBJECTS_LIST[0]);
  const [date, setDate] = useState<string>("2026-05-08");
  const [startTime, setStartTime] = useState<string>("10:00");
  const [endTime, setEndTime] = useState<string>("11:00");
  const [batchCode, setBatchCode] = useState<string>("SLOT-CUSTOM-01");
  const [, setCreatedFeedback] = useState<boolean>(false);

  const hubEntries = entries.filter((e) => e.category === "Mentoring" || e.category === "Game Plan");

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const startParts = startTime.split(":").map(Number);
    const endParts = endTime.split(":").map(Number);
    const totalHours = (endParts[0] + endParts[1] / 60) - (startParts[0] + startParts[1] / 60);

    const newRecord: TrackingEntry = {
      trackingID: `SLOT-${Date.now().toString().slice(-4)}`,
      spocName: faculty,
      vertical,
      subject,
      category: slotType,
      date,
      startTime,
      endTime,
      totalHoursDecimal: Math.max(0.5, Number(totalHours.toFixed(2))),
      batchCode,
      details: "Personalized student diagnostic walkthrough",
      approvalStatus: "Approved",
      slaRisk: "low",
      validationScore: 100,
      createdDate: new Date().toISOString().replace("T", " ").slice(0, 19),
    };

    onAddSlot(newRecord);
    setCreatedFeedback(true);
    setTimeout(() => setCreatedFeedback(false), 2500);
  };

  const getCatClass = (cat: string) => {
    if (cat === "Mentoring") return { bg: "rgba(13,148,136,0.1)", color: "#0D9488", label: "MENTOR" };
    if (cat === "Game Plan") return { bg: "rgba(79,70,229,0.1)", color: "#4F46E5", label: "GAME PLAN" };
    return { bg: "rgba(249,115,22,0.1)", color: "#F97316", label: cat };
  };

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  const getAvatarColor = (name: string) => {
    const colors = ["#2563EB", "#7C3AED", "#0D9488", "#D97706", "#DC2626", "#059669"];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx];
  };

  const categories = ["All", "Face to Face class", "Online class", "Forum", "Mentoring", "Game Plan"];
  const [selectedCat, setSelectedCat] = useState("All");

  const displayed = selectedCat === "All" ? hubEntries : hubEntries.filter((e) => e.category === selectedCat);

  const totalSessions = hubEntries.length;
  const totalHours = hubEntries.reduce((s, e) => s + e.totalHoursDecimal, 0);
  const pendingCount = hubEntries.filter((e) => e.approvalStatus === "Pending").length;
  const activeFaculty = new Set(hubEntries.map((e) => e.spocName)).size;

  return (
    <div className="page-body">
      {/* LEFT RAIL */}
      <div className="rail">
        {/* Category Filter */}
        <div className="rail-card">
          <div className="rail-card-header">
            <div className="rail-card-title"><BookOpen size={14} />Categories</div>
          </div>
          <div className="rail-card-body" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: selectedCat === cat ? 600 : 400,
                  background: selectedCat === cat ? "rgba(37,99,235,0.08)" : "transparent",
                  color: selectedCat === cat ? "#2563EB" : "#64748B",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>{cat === "All" ? "All Categories" : cat}</span>
                <span style={{ fontSize: "10px", color: "#94A3B8" }}>
                  {cat === "All" ? hubEntries.length : hubEntries.filter((e) => e.category === cat).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="rail-card">
          <div className="rail-card-header">
            <div className="rail-card-title"><Users size={14} />Quick Stats</div>
          </div>
          <div className="rail-card-body" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: <BookOpen size={14} />, label: "Total Sessions", value: totalSessions, color: "#2563EB" },
              { icon: <Clock size={14} />, label: "Hours Logged", value: `${totalHours.toFixed(1)}h`, color: "#10B981" },
              { icon: <Sparkles size={14} />, label: "Pending Review", value: pendingCount, color: "#F97316" },
              { icon: <Users size={14} />, label: "Active Faculty", value: activeFaculty, color: "#8B5CF6" },
            ].map((stat) => (
              <div key={stat.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: "#F8FAFC", borderRadius: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748B" }}>
                  {stat.icon}
                  <span style={{ fontSize: "12px" }}>{stat.label}</span>
                </div>
                <span style={{ fontSize: "16px", fontWeight: 700, color: stat.color }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Availability Builder */}
        <div className="rail-card" style={{ border: "1px solid rgba(13,148,136,0.2)", background: "linear-gradient(135deg, #F0FDFA, #ECFDF5)" }}>
          <div className="rail-card-header" style={{ borderBottom: "1px solid rgba(13,148,136,0.1)" }}>
            <div className="rail-card-title"><CalendarPlus size={14} />Add Slot</div>
          </div>
          <div className="rail-card-body" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* Slot Type Toggle */}
            <div style={{ display: "flex", gap: "4px", background: "#F8FAFC", padding: "4px", borderRadius: "8px" }}>
              <button
                onClick={() => setSlotType("Mentoring")}
                style={{ flex: 1, padding: "6px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, border: "none", cursor: "pointer", background: slotType === "Mentoring" ? "#0D9488" : "transparent", color: slotType === "Mentoring" ? "white" : "#64748B", fontFamily: "inherit" }}
              >
                Mentoring
              </button>
              <button
                onClick={() => setSlotType("Game Plan")}
                style={{ flex: 1, padding: "6px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, border: "none", cursor: "pointer", background: slotType === "Game Plan" ? "#4F46E5" : "transparent", color: slotType === "Game Plan" ? "white" : "#64748B", fontFamily: "inherit" }}
              >
                Game Plan
              </button>
            </div>

            <select
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #E2E8F0", fontSize: "11px", fontFamily: "inherit", background: "white", color: "#0F172A", outline: "none" }}
            >
              {FACULTY_LIST.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>

            <div style={{ display: "flex", gap: "6px" }}>
              <select
                value={vertical}
                onChange={(e) => setVertical(e.target.value as any)}
                style={{ flex: 1, padding: "7px 8px", borderRadius: "6px", border: "1px solid #E2E8F0", fontSize: "11px", fontFamily: "inherit", background: "white", color: "#0F172A", outline: "none" }}
              >
                <option value="Retail-CPA">CPA</option>
                <option value="Retail-CMA">CMA</option>
              </select>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ flex: 1, padding: "7px 8px", borderRadius: "6px", border: "1px solid #E2E8F0", fontSize: "11px", fontFamily: "inherit", background: "white", color: "#0F172A", outline: "none" }}
              >
                {SUBJECTS_LIST.map((s) => <option key={s} value={s}>{s.split(" - ")[0]}</option>)}
              </select>
            </div>

            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: "7px 10px", borderRadius: "6px", border: "1px solid #E2E8F0", fontSize: "11px", fontFamily: "inherit", background: "white", color: "#0F172A", outline: "none" }} />

            <div style={{ display: "flex", gap: "6px" }}>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={{ flex: 1, padding: "7px 8px", borderRadius: "6px", border: "1px solid #E2E8F0", fontSize: "11px", fontFamily: "inherit", background: "white", color: "#0F172A", outline: "none" }} />
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={{ flex: 1, padding: "7px 8px", borderRadius: "6px", border: "1px solid #E2E8F0", fontSize: "11px", fontFamily: "inherit", background: "white", color: "#0F172A", outline: "none" }} />
            </div>

            <input
              type="text"
              value={batchCode}
              onChange={(e) => setBatchCode(e.target.value)}
              placeholder="Batch code..."
              style={{ padding: "7px 10px", borderRadius: "6px", border: "1px solid #E2E8F0", fontSize: "11px", fontFamily: "inherit", background: "white", color: "#0F172A", outline: "none" }}
            />

            <button
              onClick={handleCreateSlot as any}
              className="btn btn-primary"
              style={{ background: slotType === "Game Plan" ? "#4F46E5" : "#0D9488", padding: "8px" }}
            >
              <CheckSquare size={12} /> Publish Slot
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT MAIN AREA */}
      <div className="main-area">
        {/* KPI Row */}
        <div className="charts-row">
          {[
            { label: "Total Sessions", value: totalSessions, color: "#2563EB", border: "#2563EB" },
            { label: "Total Hours", value: `${totalHours.toFixed(1)}h`, color: "#10B981", border: "#10B981" },
            { label: "Active Faculty", value: activeFaculty, color: "#8B5CF6", border: "#8B5CF6" },
            { label: "Pending Review", value: pendingCount, color: "#F97316", border: "#F97316" },
          ].map((kpi) => (
            <div key={kpi.label} className="chart-card" style={{ borderTop: `3px solid ${kpi.border}` }}>
              <div className="chart-header"><div className="chart-title"><div className="dot" style={{ background: kpi.color }}></div>{kpi.label}</div></div>
              <div className="chart-body">
                <div style={{ fontSize: "28px", fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Session List Card */}
        <div className="chart-card primary">
          <div className="chart-header">
            <div className="chart-title"><BookOpen size={14} />Session Management</div>
            <span style={{ fontSize: "10px", fontWeight: 700, background: "#2563EB", color: "white", padding: "2px 8px", borderRadius: "10px" }}>{displayed.length}</span>
          </div>
          <div className="chart-body" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {displayed.length === 0 ? (
              <p style={{ textAlign: "center", padding: "32px", color: "#64748B", fontSize: "12px" }}>No {selectedCat === "All" ? "mentoring/game plan" : selectedCat} sessions registered yet.</p>
            ) : (
              displayed.map((entry) => {
                const cat = getCatClass(entry.category);
                return (
                  <div key={entry.trackingID} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "14px", background: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
                    {/* Avatar */}
                    <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: getAvatarColor(entry.spocName), display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "13px", fontWeight: 700, flexShrink: 0 }}>
                      {getInitials(entry.spocName)}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: cat.bg, color: cat.color }}>{cat.label}</span>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#0F172A" }}>{entry.spocName}</span>
                        <span className="queue-id">{entry.batchCode || entry.trackingID}</span>
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748B", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>{entry.subject}</span>
                        <span>·</span>
                        <span style={{ fontWeight: 600, color: entry.vertical === "Retail-CPA" ? "#4F46E5" : "#0D9488" }}>{entry.vertical.replace("Retail-", "")}</span>
                        <span>·</span>
                        <span>{entry.date}</span>
                      </div>
                    </div>

                    {/* Time */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
                      <span style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>{entry.totalHoursDecimal}h</span>
                      <span style={{ fontSize: "10px", color: "#94A3B8" }}>{entry.startTime} - {entry.endTime}</span>
                    </div>

                    {/* Status */}
                    <span className={`queue-status-pill ${entry.approvalStatus === "Approved" ? "pill-approved" : entry.approvalStatus === "Pending" ? "pill-pending" : "pill-rejected"}`}>
                      {entry.approvalStatus}
                    </span>

                    {/* Score */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: entry.validationScore >= 90 ? "#10B981" : entry.validationScore >= 70 ? "#F59E0B" : "#EF4444" }}>{entry.validationScore}%</span>
                      <div style={{ width: "40px", height: "4px", background: "#E2E8F0", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ width: `${entry.validationScore}%`, height: "100%", background: entry.validationScore >= 90 ? "#10B981" : entry.validationScore >= 70 ? "#F59E0B" : "#EF4444" }}></div>
                      </div>
                    </div>

                    {/* AI badge */}
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", background: "rgba(16,185,129,0.08)", borderRadius: "6px", flexShrink: 0 }}>
                      <Sparkles size={11} style={{ color: "#10B981" }} />
                      <span style={{ fontSize: "9px", fontWeight: 700, color: "#059669" }}>VERIFIED</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};