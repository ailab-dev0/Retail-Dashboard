import { useMemo, useState } from "react";
import { FileText, TrendingUp, Clock, Users, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ReportsPage() {
  const { entries } = useApp();
  const [dateFrom] = useState("2026-05-01");
  const [dateTo] = useState("2026-05-31");

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (dateFrom && e.date < dateFrom) return false;
      if (dateTo && e.date > dateTo) return false;
      return true;
    });
  }, [entries, dateFrom, dateTo]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const approved = filtered.filter((e) => e.approvalStatus === "Approved").length;
    const pending = filtered.filter((e) => e.approvalStatus === "Pending").length;
    const faculty = new Set(filtered.map((e) => e.spocName)).size;
    const totalHours = filtered.reduce((sum, e) => sum + e.totalHoursDecimal, 0);
    const avgScore = total > 0 ? Math.round(filtered.reduce((sum, e) => sum + e.validationScore, 0) / total) : 0;
    return { total, approved, pending, faculty, totalHours, avgScore, rate: total > 0 ? Math.round((approved / total) * 100) : 0 };
  }, [filtered]);

  const byCategory = useMemo(() => {
    const cats = ["Face to Face class", "Online class", "Forum", "Mentoring", "Game Plan"];
    return cats.map((cat) => {
      const items = filtered.filter((e) => e.category === cat);
      return { cat, count: items.length, hours: items.reduce((s, e) => s + e.totalHoursDecimal, 0) };
    }).filter((c) => c.count > 0);
  }, [filtered]);

  const byVertical = useMemo(() => {
    return [
      { name: "CPA", full: "Retail-CPA", count: filtered.filter((e) => e.vertical === "Retail-CPA").length },
      { name: "CMA", full: "Retail-CMA", count: filtered.filter((e) => e.vertical === "Retail-CMA").length },
    ];
  }, [filtered]);

  const handleExportCSV = () => {
    const headers = ["TrackingID", "Faculty", "Subject", "Category", "Vertical", "Date", "Hours", "Status", "Score"];
    const rows = filtered.map((e) => [e.trackingID, e.spocName, e.subject, e.category, e.vertical, e.date, e.totalHoursDecimal, e.approvalStatus, e.validationScore]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aos-report-${dateFrom}-${dateTo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCatClass = (cat: string) => {
    if (cat === "Face to Face class") return "f2f";
    if (cat === "Online class") return "online";
    if (cat === "Mentoring") return "mentor";
    return "forum";
  };

  return (
    <div className="main-area">
      {/* KPIs */}
      <div className="charts-row">
        <div className="chart-card primary">
          <div className="chart-header">
            <div className="chart-title">
              <TrendingUp size={14} />
              Approval Rate
            </div>
          </div>
          <div className="chart-body">
            <div className="rate-gauge-wrap">
              <div className="gauge-svg-wrap">
                <svg viewBox="0 0 200 110" preserveAspectRatio="xMidYMid meet">
                  <path className="gauge-track" d="M20 90 A 70 70 0 0 1 180 90" />
                  <path className="gauge-fill" d="M20 90 A 70 70 0 0 1 180 90" strokeDasharray="220" strokeDashoffset={Math.round(220 - (stats.rate / 100) * 220)} />
                  <text x="100" y="78" textAnchor="middle" className="gauge-value">{stats.rate}%</text>
                  <text x="100" y="94" textAnchor="middle" className="gauge-label-text">Overall Rate</text>
                </svg>
              </div>
              <div className="rate-stats">
                <div className="rate-stat">
                  <div className="rate-stat-val">{stats.total}</div>
                  <div className="rate-stat-label">Total</div>
                </div>
                <div className="rate-stat">
                  <div className="rate-stat-val green">{stats.approved}</div>
                  <div className="rate-stat-label">Approved</div>
                </div>
                <div className="rate-stat">
                  <div className="rate-stat-val orange">{stats.pending}</div>
                  <div className="rate-stat-label">Pending</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <Clock size={14} />
              Report Summary
            </div>
            <button onClick={handleExportCSV} className="btn btn-blue">Export CSV</button>
          </div>
          <div className="chart-body">
            <div className="week-stats">
              <div className="week-stat-row">
                <div className="week-stat-label"><FileText size={14} /> Total Entries</div>
                <div><span className="week-stat-value">{stats.total}</span></div>
              </div>
              <div className="week-stat-row">
                <div className="week-stat-label"><Users size={14} /> Active Faculty</div>
                <div><span className="week-stat-value">{stats.faculty}</span></div>
              </div>
              <div className="week-stat-row">
                <div className="week-stat-label"><CheckCircle2 size={14} /> Total Hours</div>
                <div><span className="week-stat-value">{stats.totalHours.toFixed(1)}h</span></div>
              </div>
              <div className="week-stat-row">
                <div className="week-stat-label"><TrendingUp size={14} /> Avg Score</div>
                <div><span className="week-stat-value">{stats.avgScore}%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category distribution */}
      <div className="chart-card primary">
        <div className="chart-header">
          <div className="chart-title">
            <div className="dot green"></div> Category Distribution
          </div>
          <span className="text-[11px] text-[#64748B]">{dateFrom} — {dateTo}</span>
        </div>
        <div className="chart-body">
          <div className="cat-rows">
            {byCategory.map(({ cat, count, hours }) => (
              <div key={cat} className="cat-row">
                <div className={`cat-icon ${getCatClass(cat)}`}>
                  <FileText size={14} />
                </div>
                <div className="cat-info">
                  <div className="cat-name-row">
                    <div className="cat-name">{cat}</div>
                    <div className="cat-nums">{count} entries · {hours.toFixed(1)}h</div>
                  </div>
                  <div className="cat-bar-track">
                    <div className="cat-bar-seg approved" style={{ width: `${(count / stats.total) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vertical split */}
      <div className="charts-row">
        {byVertical.map(({ name, full, count }) => {
          const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
          return (
            <div key={full} className="chart-card">
              <div className="chart-header">
                <div className="chart-title">{name} Vertical</div>
                <span className="text-[11px] font-bold text-[#64748B]">{pct}%</span>
              </div>
              <div className="chart-body">
                <div className="cat-bar-track">
                  <div className={`cat-bar-seg ${full === "Retail-CPA" ? "approved" : "pending"}`} style={{ width: `${pct}%` }}></div>
                </div>
                <div className="mt-2 text-xs text-[#94A3B8]">{count} entries</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}