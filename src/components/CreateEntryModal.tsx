import { useState } from "react";
import { X } from "lucide-react";
import { FACULTY_LIST, SUBJECTS_LIST } from "../data/mockData";
import type { TrackingEntry } from "../data/mockData";

interface CreateEntryModalProps {
  onClose: () => void;
  onSubmit: (entry: TrackingEntry) => void;
}

export function CreateEntryModal({ onClose, onSubmit }: CreateEntryModalProps) {
  const [spocName, setSpocName] = useState(FACULTY_LIST[0]);
  const [vertical, setVertical] = useState<"Retail-CPA" | "Retail-CMA">("Retail-CPA");
  const [subject, setSubject] = useState(SUBJECTS_LIST[0]);
  const [category, setCategory] = useState<TrackingEntry["category"]>("Face to Face class");
  const [date, setDate] = useState("2026-05-08");
  const [hours, setHours] = useState("2.5");
  const [details, setDetails] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trackingID = String(Math.floor(100000 + Math.random() * 900000));
    const newEntry: TrackingEntry = {
      trackingID,
      spocName,
      vertical,
      subject,
      category,
      date,
      startTime: "09:00",
      endTime: "11:30",
      totalHoursDecimal: parseFloat(hours) || 2.0,
      batchCode: `BATCH-${vertical.toUpperCase()}-${subject}`,
      details: details || `${category} operation record`,
      approvalStatus: "Pending",
      slaRisk: "low",
      validationScore: 92,
      createdDate: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    onSubmit(newEntry);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9] bg-[#F8FAFC]">
          <h3 className="text-sm font-bold text-[#0F172A] font-['Outfit']">Create New Tracking Entry</h3>
          <button onClick={onClose} className="queue-action-btn">
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#64748B]">Faculty Lead</label>
            <select
              value={spocName}
              onChange={(e) => setSpocName(e.target.value)}
              className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#0F172A] outline-none focus:border-[#2563EB]"
            >
              {FACULTY_LIST.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#64748B]">Vertical</label>
              <select
                value={vertical}
                onChange={(e) => setVertical(e.target.value as "Retail-CPA" | "Retail-CMA")}
                className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#0F172A] outline-none focus:border-[#2563EB]"
              >
                <option value="Retail-CPA">Retail-CPA</option>
                <option value="Retail-CMA">Retail-CMA</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#64748B]">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#0F172A] outline-none focus:border-[#2563EB]"
              >
                {SUBJECTS_LIST.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#64748B]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TrackingEntry["category"])}
                className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#0F172A] outline-none focus:border-[#2563EB]"
              >
                <option value="Face to Face class">Face-to-Face</option>
                <option value="Online class">Online</option>
                <option value="Forum">Forum</option>
                <option value="Mentoring">Mentoring</option>
                <option value="Game Plan">Game Plan</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#64748B]">Duration (Hours)</label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                max="12"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#0F172A] outline-none focus:border-[#2563EB]"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#64748B]">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#0F172A] outline-none focus:border-[#2563EB]"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#64748B]">Execution Details</label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide context for approval routes..."
              className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#0F172A] outline-none focus:border-[#2563EB] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-blue"
            >
              Insert Live Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}