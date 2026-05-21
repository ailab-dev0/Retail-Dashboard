import React, { useState } from "react";
import type { TrackingEntry } from "../data/mockData";
import { CheckCircle, XCircle, ShieldAlert, ListFilter, UserCheck } from "lucide-react";

interface ApprovalQueueViewProps {
  entries: TrackingEntry[];
  onApprove: (id: string) => void;
  onDisapprove: (id: string) => void;
  onBulkApprove: (ids: string[]) => void;
}

export const ApprovalQueueView: React.FC<ApprovalQueueViewProps> = ({
  entries,
  onApprove,
  onDisapprove,
  onBulkApprove,
}) => {
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved" | "Disapproved">("Pending");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter local entries
  const displayedEntries = entries.filter((e) => {
    if (statusFilter === "All") return true;
    return e.approvalStatus === statusFilter;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === displayedEntries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayedEntries.map((e) => e.trackingID));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExecuteBulkApprove = () => {
    if (selectedIds.length > 0) {
      onBulkApprove(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div className="card p-5 flex flex-col gap-4 border-t border-t-[#E2E8F0]">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#0F172A]">Granular Approvals & SLA Routing Queue</h3>
            <p className="text-xs text-[#64748B]">Auditing faculty logs mapped to active subjects and intervals</p>
          </div>
        </div>

        {/* Filters & Bulk Trigger */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#F8FAFC] px-2.5 py-1.5 rounded-lg border border-[#E2E8F0]">
            <ListFilter className="w-3.5 h-3.5 text-[#64748B]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-[#0F172A] border-none outline-none cursor-pointer"
            >
              <option value="Pending">Status: Pending Only</option>
              <option value="Approved">Status: Approved Only</option>
              <option value="Disapproved">Status: Disapproved Only</option>
              <option value="All">Status: All Records</option>
            </select>
          </div>

          {selectedIds.length > 0 && (
            <button
              onClick={handleExecuteBulkApprove}
              className="btn btn-success text-xs py-1.5 px-3 font-bold animate-pulse-slow"
            >
              Authorize Selected ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      <hr className="border-[#E2E8F0]/60" />

      {/* Primary Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === displayedEntries.length}
                  onChange={toggleSelectAll}
                  className="accent-[#2563EB] cursor-pointer"
                />
              </th>
              <th className="p-3 text-xs font-bold text-[#64748B] uppercase">Tracking / SPOC</th>
              <th className="p-3 text-xs font-bold text-[#64748B] uppercase">Scope Context</th>
              <th className="p-3 text-xs font-bold text-[#64748B] uppercase">Interval & Hours</th>
              <th className="p-3 text-xs font-bold text-[#64748B] uppercase">Validation / Risk</th>
              <th className="p-3 text-xs font-bold text-[#64748B] uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]/60">
            {displayedEntries.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-xs text-[#64748B]">
                  No records matching the configured filter queue criteria.
                </td>
              </tr>
            ) : (
              displayedEntries.map((entry) => (
                <tr key={entry.trackingID} className="hover:bg-[#F8FAFC]/50 transition-colors">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(entry.trackingID)}
                      onChange={() => toggleSelectOne(entry.trackingID)}
                      className="accent-[#2563EB] cursor-pointer"
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#0F172A]">{entry.spocName}</span>
                      <span className="text-[10px] font-mono text-[#64748B]">{entry.trackingID}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[#0F172A]">{entry.subject}</span>
                        <span className={`badge ${entry.vertical === "Retail-CPA" ? "badge-cpa" : "badge-cma"} text-[9px]`}>
                          {entry.vertical.replace("Retail-", "")}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#64748B]">{entry.category}</span>
                      {entry.details && entry.details !== "-" && (
                        <span className="text-[10px] text-[#64748B] italic max-w-xs truncate">
                          "{entry.details}"
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#0F172A]">{entry.totalHoursDecimal} Hrs</span>
                      <span className="text-[10px] text-[#64748B]">
                        {entry.date} · {entry.startTime}-{entry.endTime}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-[#0F172A]">Score: {entry.validationScore}%</span>
                        <div className="w-12 h-1 bg-[#E2E8F0] rounded-full overflow-hidden inline-block">
                          <div
                            className={`h-full ${entry.validationScore >= 90 ? "bg-[#10B981]" : "bg-[#F59E0B]"}`}
                            style={{ width: `${entry.validationScore}%` }}
                          />
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-0.5 text-[9px] font-bold uppercase ${
                          entry.slaRisk === "high"
                            ? "text-[#DC2626]"
                            : entry.slaRisk === "medium"
                            ? "text-[#D97706]"
                            : "text-[#059669]"
                        }`}
                      >
                        <ShieldAlert className="w-3 h-3" /> {entry.slaRisk} Risk
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {entry.approvalStatus === "Pending" ? (
                        <>
                          <button
                            onClick={() => onApprove(entry.trackingID)}
                            className="p-1.5 text-[#10B981] hover:bg-[#ECFDF5] rounded-lg transition-colors"
                            title="Approve immediately"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDisapprove(entry.trackingID)}
                            className="p-1.5 text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                            title="Disapprove entry"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <span className={`badge badge-${entry.approvalStatus.toLowerCase()}`}>
                          {entry.approvalStatus}
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
    </div>
  );
};
