import { useState, useMemo } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock, Users, BookOpen, Plus, Filter } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function BatchSchedulePage() {
  const { entries } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date("2026-05-15"));
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  const entriesByDate = useMemo(() => {
    return entries.reduce((acc, entry) => {
      if (!acc[entry.date]) acc[entry.date] = [];
      acc[entry.date].push(entry);
      return acc;
    }, {} as Record<string, typeof entries>);
  }, [entries]);

  const today = new Date("2026-05-15");

  const getWeekDays = () => {
    const days: Date[] = [];
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const getMonthDays = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() - firstDay.getDay());
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(new Date(d));
    }
    return days;
  };

  const weekDays = getWeekDays();
  const monthDays = getMonthDays();
  const monthLabel = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const viewDays = viewMode === "week" ? weekDays : monthDays;

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const isToday = (d: Date) =>
    d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();

  const isCurrentMonth = (d: Date) => d.getMonth() === currentDate.getMonth();

  const getEntriesForDate = (d: Date) => entriesByDate[formatDate(d)] || [];

  const navigate = (direction: number) => {
    const next = new Date(currentDate);
    if (viewMode === "week") {
      next.setDate(next.getDate() + direction * 7);
    } else {
      next.setMonth(next.getMonth() + direction);
    }
    setCurrentDate(next);
  };

  const getCatColor = (cat: string) => {
    if (cat === "Face to Face class") return { bg: "rgba(6,182,212,0.12)", color: "#06B6D4", border: "#06B6D4" };
    if (cat === "Online class") return { bg: "rgba(139,92,246,0.12)", color: "#8B5CF6", border: "#8B5CF6" };
    if (cat === "Mentoring") return { bg: "rgba(234,179,8,0.12)", color: "#CA8A04", border: "#CA8A04" };
    return { bg: "rgba(249,115,22,0.12)", color: "#F97316", border: "#F97316" };
  };

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const getAvatarColor = (name: string) => {
    const colors = ["#2563EB", "#7C3AED", "#0D9488", "#D97706", "#DC2626", "#059669", "#4F46E5"];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const totalSlots = Object.values(entriesByDate).reduce((s, arr) => s + arr.length, 0);
  const totalHours = Object.values(entriesByDate).reduce((s, arr) => s + arr.reduce((a, e) => a + e.totalHoursDecimal, 0), 0);
  const activeFaculty = new Set(entries.map((e) => e.spocName)).size;

  return (
    <div className="page-body">
      {/* LEFT RAIL */}
      <div className="rail">
        <div className="rail-card">
          <div className="rail-card-header">
            <div className="rail-card-title"><Calendar size={14} />Schedule Stats</div>
          </div>
          <div className="rail-card-body" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { icon: <Calendar size={13} />, label: "Total Slots", value: totalSlots, color: "#2563EB" },
              { icon: <Clock size={13} />, label: "Hours", value: `${totalHours.toFixed(0)}h`, color: "#10B981" },
              { icon: <Users size={13} />, label: "Faculty", value: activeFaculty, color: "#8B5CF6" },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: "#F8FAFC", borderRadius: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748B" }}>{s.icon}<span style={{ fontSize: "11px" }}>{s.label}</span></div>
                <span style={{ fontSize: "16px", fontWeight: 700, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rail-card">
          <div className="rail-card-header">
            <div className="rail-card-title"><Filter size={14} />Category</div>
          </div>
          <div className="rail-card-body" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {["All", "Face to Face class", "Online class", "Forum", "Mentoring", "Game Plan"].map((cat) => (
              <button
                key={cat}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", textAlign: "left", fontSize: "11px", background: "transparent", color: "#64748B", border: "none", cursor: "pointer", fontFamily: "inherit", display: "flex" }}
              >
                <span>{cat}</span>
                <span style={{ marginLeft: "auto", fontSize: "10px", color: "#94A3B8" }}>
                  {cat === "All" ? totalSlots : entries.filter((e) => e.category === cat).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rail-card">
          <div className="rail-card-header">
            <div className="rail-card-title"><BookOpen size={14} />Vertical</div>
          </div>
          <div className="rail-card-body" style={{ display: "flex", gap: "6px" }}>
            {["CPA", "CMA"].map((v) => (
              <button
                key={v}
                style={{ flex: 1, padding: "7px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, border: "1px solid #E2E8F0", cursor: "pointer", background: "#F8FAFC", color: "#64748B", fontFamily: "inherit" }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="rail-card" style={{ border: "1px solid rgba(37,99,235,0.2)", background: "linear-gradient(135deg, #EFF6FF, #F0F9FF)" }}>
          <div className="rail-card-header" style={{ borderBottom: "1px solid rgba(37,99,235,0.1)" }}>
            <div className="rail-card-title"><Calendar size={14} />Navigate</div>
          </div>
          <div className="rail-card-body" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#1E40AF", textAlign: "center" }}>{monthLabel}</div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={() => navigate(-1)} style={{ flex: 1, padding: "7px", borderRadius: "6px", border: "1px solid #BFDBFE", background: "white", color: "#2563EB", fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontFamily: "inherit" }}>
                <ChevronLeft size={12} /> Prev
              </button>
              <button onClick={() => setCurrentDate(new Date("2026-05-15"))} style={{ flex: 1, padding: "7px", borderRadius: "6px", border: "1px solid #BFDBFE", background: "white", color: "#2563EB", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Today
              </button>
              <button onClick={() => navigate(1)} style={{ flex: 1, padding: "7px", borderRadius: "6px", border: "1px solid #BFDBFE", background: "white", color: "#2563EB", fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontFamily: "inherit" }}>
                Next <ChevronRight size={12} />
              </button>
            </div>
            <div style={{ display: "flex", gap: "4px", background: "#F8FAFC", padding: "4px", borderRadius: "8px" }}>
              <button onClick={() => setViewMode("week")} style={{ flex: 1, padding: "6px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, border: "none", cursor: "pointer", background: viewMode === "week" ? "#2563EB" : "transparent", color: viewMode === "week" ? "white" : "#64748B", fontFamily: "inherit" }}>
                Week
              </button>
              <button onClick={() => setViewMode("month")} style={{ flex: 1, padding: "6px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, border: "none", cursor: "pointer", background: viewMode === "month" ? "#2563EB" : "transparent", color: viewMode === "month" ? "white" : "#64748B", fontFamily: "inherit" }}>
                Month
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT MAIN AREA */}
      <div className="main-area">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Calendar size={20} style={{ color: "#2563EB" }} />
            </div>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", margin: 0 }}>Batch Schedule</h2>
              <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>Calendar overview of all scheduled sessions</p>
            </div>
          </div>
          <button style={{ padding: "8px 16px", background: "#2563EB", color: "white", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "inherit" }}>
            <Plus size={14} /> Add Session
          </button>
        </div>

        <div className="chart-card primary" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #E2E8F0", background: "#F8FAFC" }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} style={{ padding: "10px 8px", textAlign: "center", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", borderRight: "1px solid #E2E8F0" }}>
                {day}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", flex: 1, overflowY: "auto" }}>
            {viewDays.map((day: Date) => {
              const dayEntries = getEntriesForDate(day);
              const dayIsToday = isToday(day);
              const dayIsCurrentMonth = isCurrentMonth(day);

              return (
                <div
                  key={day.toISOString()}
                  style={{
                    minHeight: viewMode === "week" ? "200px" : "100px",
                    borderRight: "1px solid #E2E8F0",
                    borderBottom: "1px solid #E2E8F0",
                    padding: "6px",
                    background: dayIsToday ? "rgba(37,99,235,0.03)" : dayIsCurrentMonth ? "white" : "#F8FAFC",
                  }}
                >
                  <div style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: dayIsToday ? 700 : 500,
                    color: dayIsToday ? "white" : dayIsCurrentMonth ? "#0F172A" : "#94A3B8",
                    background: dayIsToday ? "#2563EB" : "transparent",
                    marginBottom: "6px",
                  }}>
                    {day.getDate()}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {dayEntries.slice(0, viewMode === "week" ? 5 : 2).map((entry) => {
                      const cs = getCatColor(entry.category);
                      return (
                        <div
                          key={entry.trackingID}
                          style={{
                            padding: "5px 7px",
                            borderRadius: "6px",
                            background: cs.bg,
                            borderLeft: `3px solid ${cs.border}`,
                            cursor: "pointer",
                          }}
                          title={`${entry.spocName} · ${entry.subject} · ${entry.totalHoursDecimal}h`}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: getAvatarColor(entry.spocName), display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "8px", fontWeight: 700, flexShrink: 0 }}>
                              {getInitials(entry.spocName)}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: "10px", fontWeight: 600, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{entry.spocName.split(" ")[0]}</div>
                              <div style={{ fontSize: "9px", color: cs.color }}>{entry.totalHoursDecimal}h · {entry.subject.split(" - ")[0]}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {dayEntries.length > (viewMode === "week" ? 5 : 2) && (
                      <div style={{ fontSize: "9px", fontWeight: 600, color: "#64748B", paddingLeft: "4px" }}>+{dayEntries.length - (viewMode === "week" ? 5 : 2)} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}