import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { MOCK_ENTRIES } from "../data/mockData";
import type { TrackingEntry } from "../data/mockData";
import { FILTER_DEFAULTS } from "../components/FiltersBar";
import type { FilterState } from "../components/FiltersBar";

interface AppContextType {
  entries: TrackingEntry[];
  setEntries: React.Dispatch<React.SetStateAction<TrackingEntry[]>>;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filteredEntries: TrackingEntry[];
  handleApprove: (id: string) => void;
  handleDisapprove: (id: string) => void;
  handleBulkApprove: (ids: string[]) => void;
  handleAddEntry: (newEntry: TrackingEntry) => void;
  pendingCount: number;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<TrackingEntry[]>(MOCK_ENTRIES);
  const [filters, setFilters] = useState<FilterState>(FILTER_DEFAULTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (filters.vertical === "CPA" && entry.vertical !== "Retail-CPA") return false;
      if (filters.vertical === "CMA" && entry.vertical !== "Retail-CMA") return false;
      if (filters.category !== "All" && entry.category !== filters.category) return false;
      if (filters.status !== "All Status" && entry.approvalStatus !== filters.status) return false;

      // Date range filter
      if (filters.fromMonth) {
        const entryDate = new Date(entry.date);
        const from = new Date(filters.fromMonth + "-01");
        const to = filters.toMonth ? new Date(filters.toMonth + "-01") : new Date(filters.fromMonth + "-01");
        to.setMonth(to.getMonth() + 1);
        if (entryDate < from || entryDate >= to) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !entry.spocName.toLowerCase().includes(q) &&
          !entry.subject.toLowerCase().includes(q) &&
          !entry.trackingID.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [entries, filters, searchQuery]);

  const pendingCount = entries.filter((e) => e.approvalStatus === "Pending").length;

  const handleApprove = useCallback((id: string) => {
    setEntries((prev) => prev.map((e) => (e.trackingID === id ? { ...e, approvalStatus: "Approved" } : e)));
    showToast(`Successfully Authorized record AOS-${id}`);
  }, [showToast]);

  const handleDisapprove = useCallback((id: string) => {
    setEntries((prev) => prev.map((e) => (e.trackingID === id ? { ...e, approvalStatus: "Disapproved" } : e)));
    showToast(`Disapproved record AOS-${id} — sent back for immediate recalculation.`);
  }, [showToast]);

  const handleBulkApprove = useCallback((ids: string[]) => {
    setEntries((prev) => prev.map((e) => (ids.includes(e.trackingID) ? { ...e, approvalStatus: "Approved" } : e)));
    showToast(`Authorized ${ids.length} record${ids.length > 1 ? "s" : ""} in bulk operation.`);
  }, [showToast]);

  const handleAddEntry = useCallback((newEntry: TrackingEntry) => {
    setEntries((prev) => [newEntry, ...prev]);
    showToast(`Successfully inserted live row AOS-${newEntry.trackingID} into operational space.`);
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        entries,
        setEntries,
        filters,
        setFilters,
        searchQuery,
        setSearchQuery,
        filteredEntries,
        handleApprove,
        handleDisapprove,
        handleBulkApprove,
        handleAddEntry,
        pendingCount,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}