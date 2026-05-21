import { useState } from "react";
import { Settings, Bell, Shield, Moon } from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    slaBreach: true,
    newEntry: false,
  });
  const [slaThresholds, setSlaThresholds] = useState({
    highRisk: 24,
    mediumRisk: 48,
    lowRisk: 72,
  });

  return (
    <div className="main-area">
      <div className="charts-row">
        {/* User Profile */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title"><Settings size={14} />User Profile</div>
          </div>
          <div className="chart-body" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6]" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "15px", fontWeight: 700 }}>
              VB
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: "#0F172A" }}>Vikram B</div>
              <div className="text-xs" style={{ color: "#64748B" }}>Retail Ops Lead</div>
              <div className="text-[11px]" style={{ color: "#94A3B8", marginTop: "2px" }}>vikram@academicops.com</div>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title"><Moon size={14} />Appearance</div>
          </div>
          <div className="chart-body" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div className="text-xs font-semibold" style={{ color: "#334155" }}>Dark Mode</div>
              <div className="text-[11px]" style={{ color: "#94A3B8" }}>Switch to dark theme (coming soon)</div>
            </div>
            <button className="btn btn-white" disabled>Coming Soon</button>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title"><Bell size={14} />Notification Preferences</div>
        </div>
        <div className="chart-body" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { key: "email" as const, label: "Email Notifications", desc: "Receive daily summary reports via email" },
            { key: "push" as const, label: "Push Notifications", desc: "Browser push notifications for urgent items" },
            { key: "slaBreach" as const, label: "SLA Breach Alerts", desc: "Get notified when entries breach SLA thresholds" },
            { key: "newEntry" as const, label: "New Entry Alerts", desc: "Notify when new entries are submitted for review" },
          ].map(({ key, label, desc }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F1F5F9" }}>
              <div>
                <div className="text-xs font-semibold" style={{ color: "#334155" }}>{label}</div>
                <div className="text-[11px]" style={{ color: "#94A3B8" }}>{desc}</div>
              </div>
              <button
                onClick={() => setNotifications((p) => ({ ...p, [key]: !p[key] }))}
                style={{
                  width: "40px",
                  height: "20px",
                  borderRadius: "10px",
                  position: "relative",
                  border: "none",
                  cursor: "pointer",
                  background: notifications[key] ? "#10B981" : "#E2E8F0",
                  transition: "background 150ms",
                }}
              >
                <div style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "white",
                  position: "absolute",
                  top: "2px",
                  transition: "left 150ms",
                  left: notifications[key] ? "20px" : "2px",
                }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SLA Thresholds */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title"><Shield size={14} />SLA Threshold Configuration</div>
        </div>
        <div className="chart-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { key: "highRisk" as const, label: "High Risk", maxH: 24, color: "#DC2626" },
            { key: "mediumRisk" as const, label: "Medium Risk", maxH: 48, color: "#D97706" },
            { key: "lowRisk" as const, label: "Low Risk", maxH: 72, color: "#059669" },
          ].map(({ key, label, maxH, color }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ width: "96px", fontSize: "12px", fontWeight: 600, color: "#64748B" }}>{label}</span>
              <input
                type="range"
                min={12}
                max={maxH}
                step={12}
                value={slaThresholds[key]}
                onChange={(e) => setSlaThresholds((p) => ({ ...p, [key]: Number(e.target.value) }))}
                style={{ flex: 1, accentColor: "#2563EB" }}
              />
              <span style={{ width: "48px", fontSize: "12px", fontWeight: 700, textAlign: "right", color }}>{slaThresholds[key]}h</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}