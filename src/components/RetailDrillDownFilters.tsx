import React from "react";
import { Calendar, Filter, Check } from "lucide-react";
import { SUBJECTS_LIST, FACULTY_LIST } from "../data/mockData";

interface FiltersProps {
  dateRange: { start: string; end: string };
  setDateRange: React.Dispatch<React.SetStateAction<{ start: string; end: string }>>;
  selectedVerticals: ("Retail-CPA" | "Retail-CMA")[];
  setSelectedVerticals: React.Dispatch<React.SetStateAction<("Retail-CPA" | "Retail-CMA")[]>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedSubject: string;
  setSelectedSubject: React.Dispatch<React.SetStateAction<string>>;
  selectedFaculty: string;
  setSelectedFaculty: React.Dispatch<React.SetStateAction<string>>;
}

export const RetailDrillDownFilters: React.FC<FiltersProps> = ({
  dateRange,
  setDateRange,
  selectedVerticals,
  setSelectedVerticals,
  selectedCategory,
  setSelectedCategory,
  selectedSubject,
  setSelectedSubject,
  selectedFaculty,
  setSelectedFaculty,
}) => {
  const toggleVertical = (v: "Retail-CPA" | "Retail-CMA") => {
    if (selectedVerticals.includes(v)) {
      if (selectedVerticals.length > 1) {
        setSelectedVerticals(selectedVerticals.filter((item) => item !== v));
      }
    } else {
      setSelectedVerticals([...selectedVerticals, v]);
    }
  };

  const categories = [
    "All Categories",
    "Face to Face class",
    "Online class",
    "Forum",
    "Mentoring",
    "Game Plan",
  ];

  return (
    <div className="glass-panel p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Title and indicators */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#0F172A]">Hierarchical Drill-Down Scope</h3>
            <p className="text-xs text-[#64748B]">Global view automatically synchronized with baseline timetable</p>
          </div>
        </div>

        {/* Date Range Picker Baseline */}
        <div className="flex items-center gap-2 bg-[#F8FAFC] px-3 py-2 rounded-lg border border-[#E2E8F0]">
          <Calendar className="w-4 h-4 text-[#64748B]" />
          <span className="text-xs font-medium text-[#64748B]">Interval:</span>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
            className="bg-transparent text-xs font-semibold text-[#0F172A] border-none outline-none cursor-pointer"
          />
          <span className="text-xs text-[#64748B]">to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
            className="bg-transparent text-xs font-semibold text-[#0F172A] border-none outline-none cursor-pointer"
          />
        </div>
      </div>

      <hr className="border-[#E2E8F0]/60" />

      {/* Multi-select Verticals & Segmented Hierarchy */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Multi-select vertical pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Vertical Scope:</span>
          {(["Retail-CPA", "Retail-CMA"] as const).map((vert) => {
            const active = selectedVerticals.includes(vert);
            return (
              <button
                key={vert}
                onClick={() => toggleVertical(vert)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  active
                    ? vert === "Retail-CPA"
                      ? "bg-[#4F46E5] text-white shadow-sm"
                      : "bg-[#0D9488] text-white shadow-sm"
                    : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                }`}
              >
                {active && <Check className="w-3 h-3 stroke-[3]" />}
                {vert.replace("Retail-", "")}
              </button>
            );
          })}
        </div>

        {/* Segmented Category Filter */}
        <div className="segmented-control overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`segment-btn whitespace-nowrap ${selectedCategory === cat ? "active" : ""}`}
            >
              {cat === "All Categories" ? "Global Overview" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Subject & Faculty Drill-downs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        <div className="flex items-center gap-2 bg-[#F8FAFC] px-3 py-2 rounded-lg border border-[#E2E8F0]">
          <span className="text-xs font-semibold text-[#64748B] w-16">Subject:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="flex-1 bg-transparent text-xs font-medium text-[#0F172A] border-none outline-none cursor-pointer"
          >
            <option value="All">All Subjects (FAR, REG, AUD, CMA...)</option>
            {SUBJECTS_LIST.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-[#F8FAFC] px-3 py-2 rounded-lg border border-[#E2E8F0]">
          <span className="text-xs font-semibold text-[#64748B] w-16">Faculty:</span>
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="flex-1 bg-transparent text-xs font-medium text-[#0F172A] border-none outline-none cursor-pointer"
          >
            <option value="All">All Core Faculty Pools</option>
            {FACULTY_LIST.map((fac) => (
              <option key={fac} value={fac}>
                {fac}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
