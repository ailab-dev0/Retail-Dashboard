import React, { useState } from "react";
import { AlertTriangle, Clock, Send, Sliders, CheckCircle } from "lucide-react";

interface SLAManagerProps {
  pendingCount: number;
  overdueCount: number;
  forumBreachedCount: number;
  onManualTriggerAll: () => void;
}

export const SLANudgeManager: React.FC<SLAManagerProps> = ({
  overdueCount,
  forumBreachedCount,
  onManualTriggerAll,
}) => {
  const [autoMode, setAutoMode] = useState<boolean>(true);
  const [thresholdHours, setThresholdHours] = useState<number>(48);
  const maxQueries = 30;
  const [nudgeSent, setNudgeSent] = useState<boolean>(false);

  const handleManualNudge = () => {
    onManualTriggerAll();
    setNudgeSent(true);
    setTimeout(() => setNudgeSent(false), 3000);
  };

  return (
    <div className="card p-5 border-l-4 border-l-[#F59E0B] flex flex-col gap-4">
      {/* Header and Hybrid Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
            <Clock className="w-5 h-5 animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#0F172A]">Hybrid SLA Monitoring Engine</h3>
              <span className="badge badge-pending">Active Priority Queue</span>
            </div>
            <p className="text-xs text-[#64748B]">Automated threshold triggers combined with instantaneous direct push overrides</p>
          </div>
        </div>

        {/* Control Switches */}
        <div className="flex items-center gap-3 bg-[#F8FAFC] p-1.5 rounded-xl border border-[#E2E8F0]">
          <button
            onClick={() => setAutoMode(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              autoMode ? "bg-white text-[#2563EB] shadow-sm" : "text-[#64748B]"
            }`}
          >
            Automated Engine
          </button>
          <button
            onClick={() => setAutoMode(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !autoMode ? "bg-white text-[#D97706] shadow-sm" : "text-[#64748B]"
            }`}
          >
            Manual Routing Mode
          </button>
        </div>
      </div>

      <hr className="border-[#E2E8F0]/60" />

      {/* Threshold Sliders and Status Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
        {/* Dynamic metrics block */}
        <div className="flex flex-col gap-2 p-3 bg-[#FEF3C7]/40 rounded-xl border border-[#FDE68A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#B45309]">SLA Watch Status:</span>
            {overdueCount > 0 ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#DC2626]">
                <AlertTriangle className="w-3.5 h-3.5" /> Breached Threshold
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#059669]">
                <CheckCircle className="w-3.5 h-3.5" /> Compliance Normal
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-[#78350F]">
            <strong>{overdueCount} entries</strong> pending over {thresholdHours}h limit ·{" "}
            <strong>{forumBreachedCount} subjects</strong> over {maxQueries} pending items limit.
          </p>
        </div>

        {/* Configuration settings inline */}
        <div className="flex flex-col gap-2.5 px-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#64748B] flex items-center gap-1">
              <Sliders className="w-3 h-3" /> Auto-escalate Hours:
            </span>
            <span className="font-bold text-[#0F172A]">{thresholdHours} Hours</span>
          </div>
          <input
            type="range"
            min={12}
            max={72}
            step={12}
            value={thresholdHours}
            onChange={(e) => setThresholdHours(Number(e.target.value))}
            className="w-full accent-[#2563EB] cursor-pointer"
          />
          <div className="flex items-center justify-between text-[10px] text-[#64748B]">
            <span>12h Fast</span>
            <span>24h</span>
            <span>48h Normal</span>
            <span>72h Extended</span>
          </div>
        </div>

        {/* Trigger execution override block */}
        <div className="flex flex-col justify-center items-end gap-2">
          {autoMode ? (
            <div className="w-full text-right bg-[#EFF6FF] p-2.5 rounded-xl border border-[#BFDBFE]">
              <p className="text-[11px] font-semibold text-[#1D4ED8]">
                ✓ Auto-nudge cron triggers enabled for Overdue items.
              </p>
              <p className="text-[10px] text-[#2563EB] mt-0.5">Escalates automatically directly to Faculty & Operations SPOC.</p>
            </div>
          ) : (
            <button
              onClick={handleManualNudge}
              disabled={nudgeSent}
              className={`w-full btn ${
                nudgeSent ? "btn-success" : "btn-primary"
              } py-3 shadow-sm flex items-center justify-center gap-2 font-bold`}
            >
              {nudgeSent ? (
                <>
                  <CheckCircle className="w-4 h-4" /> Priority Escalations Broadcasted
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Trigger Urgent WhatsApp Broadcast
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
