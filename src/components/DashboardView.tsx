import React from "react";
import type { TrackingEntry, DashboardStats } from "../data/mockData";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  BookOpen,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface DashboardViewProps {
  filteredEntries: TrackingEntry[];
  stats: DashboardStats;
  onSelectView: (view: "overview" | "approvals" | "mentoring") => void;
  onTriggerDirectEscalation: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  filteredEntries,
  stats,
  onSelectView,
  onTriggerDirectEscalation,
}) => {
  // Aggregate stats based on dynamic filters
  const pendingCount = filteredEntries.filter((e) => e.approvalStatus === "Pending").length;
  const approvedCount = filteredEntries.filter((e) => e.approvalStatus === "Approved").length;
  const highRiskCount = filteredEntries.filter((e) => e.slaRisk === "high").length;
  const totalDecimalHours = filteredEntries.reduce((acc, curr) => acc + curr.totalHoursDecimal, 0);

  // Category summary array
  const categorySummary = (["Face to Face class", "Online class", "Forum", "Mentoring", "Game Plan"] as const).map(
    (cat) => {
      const catEntries = filteredEntries.filter((e) => e.category === cat);
      const hours = catEntries.reduce((sum, e) => sum + e.totalHoursDecimal, 0);
      const pending = catEntries.filter((e) => e.approvalStatus === "Pending").length;
      return { category: cat, count: catEntries.length, hours, pending };
    }
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner with Quick Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4 bg-gradient-to-r from-white via-white to-[#EFF6FF]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Anupama Executive Operations Perspective</h2>
            <p className="text-xs text-[#64748B]">
              Viewing <strong>{filteredEntries.length} records</strong> summing <strong>{totalDecimalHours.toFixed(1)} verified hours</strong>
            </p>
          </div>
        </div>

        {/* Dynamic Navigation Tabs inside dashboard view */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectView("overview")}
            className="btn btn-primary text-xs py-2 font-bold shadow-sm"
          >
            Overview Charts
          </button>
          <button
            onClick={() => onSelectView("approvals")}
            className="btn btn-secondary text-xs py-2 font-bold hover:text-[#2563EB]"
          >
            Deep-Dive Approvals ({pendingCount})
          </button>
          <button
            onClick={() => onSelectView("mentoring")}
            className="btn btn-secondary text-xs py-2 font-bold hover:text-[#0D9488]"
          >
            Mentoring & Game Plan Hub
          </button>
        </div>
      </div>

      {/* Primary KPI Grid Set */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="card p-4 border-l-4 border-l-[#F59E0B]">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold uppercase tracking-wider">Filtered Pending</span>
            <Clock className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0F172A]">{pendingCount}</span>
            <span className="text-xs font-semibold text-[#D97706] bg-[#FEF3C7] px-1.5 py-0.5 rounded">
              {stats.overdueCount} Critical Overdue
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#059669]" /> Turnaround avg: {stats.avgApprovalTimeHours}h
          </p>
        </div>

        {/* Card 2 */}
        <div className="card p-4 border-l-4 border-l-[#10B981]">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold uppercase tracking-wider">Approved Records</span>
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0F172A]">{approvedCount}</span>
            <span className="text-xs font-bold text-[#059669]">
              {((approvedCount / (filteredEntries.length || 1)) * 100).toFixed(0)}% Scope Rate
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] mt-1">Total ecosystem approvals: {stats.totalApproved}</p>
        </div>

        {/* Card 3 */}
        <div className="card p-4 border-l-4 border-l-[#DC2626]">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold uppercase tracking-wider">SLA / Risk Watch</span>
            <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0F172A]">{highRiskCount}</span>
            <span className="text-xs font-semibold text-[#DC2626] bg-[#FEF2F2] px-1.5 py-0.5 rounded">
              {stats.forumBreachedSubjects} Forum Breaches
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] mt-1">Nudge routing triggers highly suggested</p>
        </div>

        {/* Card 4 */}
        <div className="card p-4 border-l-4 border-l-[#8B5CF6]">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold uppercase tracking-wider">Faculty Compliance</span>
            <Users className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0F172A]">{stats.facultyCompliancePercent}%</span>
            <span className="text-xs font-semibold text-[#8B5CF6] bg-[#EDE9FE] px-1.5 py-0.5 rounded">
              {stats.mentoringExceptions} Slot Bottlenecks
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] mt-1">Based on timestamp variance parameters</p>
        </div>
      </div>

      {/* Main Data Split: Left Side Distribution, Right Side Live Tracking Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Category Distributions */}
        <div className="card p-5 flex flex-col gap-4 lg:col-span-1 border-t border-t-[#E2E8F0]">
          <h3 className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#2563EB]" /> Scope Distribution by Category
          </h3>
          <div className="flex flex-col gap-3">
            {categorySummary.map((item) => (
              <div key={item.category} className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A]">{item.category}</span>
                  <span className="text-xs font-bold text-[#2563EB]">{item.hours.toFixed(2)} Hrs</span>
                </div>
                {/* Custom inline fill bar */}
                <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.category === "Forum"
                        ? "bg-[#D97706]"
                        : item.category.includes("class")
                        ? "bg-[#2563EB]"
                        : "bg-[#0D9488]"
                    }`}
                    style={{ width: `${Math.min(100, (item.hours / (totalDecimalHours || 1)) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-0.5">
                  <span>{item.count} total records</span>
                  {item.pending > 0 && <span className="font-semibold text-[#D97706]">{item.pending} pending</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto p-3 bg-gradient-to-br from-[#EEF2FF] to-[#F0FDFA] rounded-xl border border-[#E0E7FF]">
            <p className="text-[11px] font-bold text-[#4F46E5] flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" /> Note on Dual Verticals:
            </p>
            <p className="text-[10px] text-[#64748B] mt-0.5">
              Entries are strongly bound to <strong>Retail-CPA</strong> or <strong>Retail-CMA</strong> parameters to guarantee strict scoping and eliminate mis-tagging errors during validation.
            </p>
          </div>
        </div>

        {/* Right column: Condensed Real-time Line Items Feed */}
        <div className="card p-5 flex flex-col gap-4 lg:col-span-2 border-t border-t-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#0F172A]">Real-time Live Filtered Items Feed</h3>
            <span className="text-xs text-[#64748B]">Showing recent {Math.min(5, filteredEntries.length)} records</span>
          </div>

          <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[420px] pr-1">
            {filteredEntries.length === 0 ? (
              <p className="text-xs text-[#64748B] text-center py-12">No records match the configured drill-down scope parameters.</p>
            ) : (
              filteredEntries.slice(0, 7).map((entry) => (
                <div
                  key={entry.trackingID}
                  className="p-3 bg-white rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-[200px] flex-1">
                    <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center font-bold text-xs text-[#4F46E5]">
                      {entry.spocName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0F172A] truncate">{entry.spocName}</span>
                        <span className={`badge ${entry.vertical === "Retail-CPA" ? "badge-cpa" : "badge-cma"} text-[9px]`}>
                          {entry.vertical.replace("Retail-", "")}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#64748B] truncate">
                        {entry.subject} · {entry.category} · {entry.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-bold text-[#0F172A]">{entry.totalHoursDecimal} Hrs</span>
                      <span className="text-[10px] text-[#64748B]">{entry.startTime} - {entry.endTime}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`badge badge-${entry.approvalStatus.toLowerCase()}`}>
                        {entry.approvalStatus}
                      </span>
                      {entry.approvalStatus === "Pending" && (
                        <button
                          onClick={() => onTriggerDirectEscalation(entry.trackingID)}
                          className="px-2 py-1 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] text-[10px] font-bold rounded transition-colors"
                          title="Send Direct Escalation Notice"
                        >
                          Nudge
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
