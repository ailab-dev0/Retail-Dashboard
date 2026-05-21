import React from "react";

export interface FilterState {
  fromMonth: string;
  toMonth: string;
  vertical: string;
  category: string;
  status: string;
}

interface FiltersBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalCount: number;
  filteredCount: number;
}

export const FILTER_DEFAULTS: FilterState = {
  fromMonth: "Jan 2026",
  toMonth: "May 2026",
  vertical: "Retail — All",
  category: "All",
  status: "All Status",
};

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  setFilters,
  totalCount,
  filteredCount,
}) => {
  const [activePreset, setActivePreset] = React.useState<string | null>(null);

  const handleChange = (key: keyof FilterState, value: string) => {
    setActivePreset(null);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyPreset = (preset: "today" | "week" | "month") => {
    setActivePreset(preset);
    if (preset === "today") {
      setFilters((prev) => ({ ...prev, fromMonth: "May 2026", toMonth: "May 2026" }));
    } else if (preset === "week") {
      setFilters((prev) => ({ ...prev, fromMonth: "Apr 2026", toMonth: "May 2026" }));
    } else if (preset === "month") {
      setFilters((prev) => ({ ...prev, fromMonth: "May 2026", toMonth: "May 2026" }));
    }
  };

  const handleReset = () => {
    setActivePreset(null);
    setFilters(FILTER_DEFAULTS);
  };

  // Compute active chips
  const activeChips: { key: keyof FilterState; label: string; val: string }[] = [];
  if (filters.fromMonth !== FILTER_DEFAULTS.fromMonth) {
    activeChips.push({ key: "fromMonth", label: "From", val: filters.fromMonth });
  }
  if (filters.toMonth !== FILTER_DEFAULTS.toMonth) {
    activeChips.push({ key: "toMonth", label: "To", val: filters.toMonth });
  }
  if (filters.vertical !== FILTER_DEFAULTS.vertical) {
    activeChips.push({ key: "vertical", label: "Vertical", val: filters.vertical });
  }
  if (filters.category !== FILTER_DEFAULTS.category) {
    activeChips.push({ key: "category", label: "Category", val: filters.category });
  }
  if (filters.status !== FILTER_DEFAULTS.status) {
    activeChips.push({ key: "status", label: "Status", val: filters.status });
  }

  const removeChip = (key: keyof FilterState) => {
    setActivePreset(null);
    setFilters((prev) => ({ ...prev, [key]: FILTER_DEFAULTS[key] }));
  };

  return (
    <>
      <div className="filters-bar">
        {/* Preset Pills */}
        <button
          className={`filter-preset-pill ${activePreset === "today" ? "active" : ""}`}
          onClick={() => handleApplyPreset("today")}
        >
          Today
        </button>
        <button
          className={`filter-preset-pill ${activePreset === "week" ? "active" : ""}`}
          onClick={() => handleApplyPreset("week")}
        >
          This Week
        </button>
        <button
          className={`filter-preset-pill ${activePreset === "month" ? "active" : ""}`}
          onClick={() => handleApplyPreset("month")}
        >
          This Month
        </button>

        <div className="filter-divider"></div>

        {/* Individual selectors */}
        <div className="filter-group">
          <label className="filter-label">From</label>
          <select
            className="filter-select"
            value={filters.fromMonth}
            onChange={(e) => handleChange("fromMonth", e.target.value)}
          >
            <option>Jan 2026</option>
            <option>Feb 2026</option>
            <option>Mar 2026</option>
            <option>Apr 2026</option>
            <option>May 2026</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">To</label>
          <select
            className="filter-select"
            value={filters.toMonth}
            onChange={(e) => handleChange("toMonth", e.target.value)}
          >
            <option>Jan 2026</option>
            <option>Feb 2026</option>
            <option>Mar 2026</option>
            <option>Apr 2026</option>
            <option>May 2026</option>
          </select>
        </div>

        <div className="filter-divider"></div>

        <div className="filter-group">
          <label className="filter-label">Vertical</label>
          <select
            className="filter-select"
            value={filters.vertical}
            onChange={(e) => handleChange("vertical", e.target.value)}
          >
            <option>Retail — All</option>
            <option>CPA</option>
            <option>CMA</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            className="filter-select"
            value={filters.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            <option value="All">All</option>
            <option value="Face to Face class">Face-to-Face</option>
            <option value="Online class">Online</option>
            <option value="Forum">Forum</option>
            <option value="Mentoring">Mentoring</option>
            <option value="Game Plan">Game Plan</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="All Status">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Disapproved">Rejected</option>
          </select>
        </div>

        <div className="filter-divider"></div>

        <span className="filter-result-count">
          {filteredCount !== totalCount ? `Showing ${filteredCount} of ${totalCount} entries` : ""}
        </span>

        <button className="btn btn-white ml-auto" onClick={handleReset}>
          Reset
        </button>
      </div>

      {/* Dynamic Filter Chips strip */}
      {activeChips.length > 0 && (
        <div className="filter-chips-bar">
          <span className="text-xs font-semibold text-[#64748B] mr-1">Active Scopes:</span>
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="filter-chip"
              onClick={() => removeChip(chip.key)}
              title="Click to remove scope"
            >
              {chip.label}: {chip.val} <span className="filter-chip-x">×</span>
            </span>
          ))}
        </div>
      )}
    </>
  );
};
