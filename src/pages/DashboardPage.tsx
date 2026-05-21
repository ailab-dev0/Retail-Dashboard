import { useState } from "react";
import { LeftRail } from "../components/LeftRail";
import { MainMetricsArea } from "../components/MainMetricsArea";
import { FiltersBar } from "../components/FiltersBar";
import { CreateEntryModal } from "../components/CreateEntryModal";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { entries, filteredEntries, handleApprove, handleDisapprove, handleAddEntry, filters, setFilters } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      <FiltersBar
        filters={filters}
        setFilters={setFilters}
        totalCount={entries.length}
        filteredCount={filteredEntries.length}
      />
      <div className="page-body">
        <LeftRail
          entries={entries}
          onOpenApprovalQueue={() => navigate("/approvals")}
        />
        <MainMetricsArea
          entries={filteredEntries}
          onApprove={handleApprove}
          onDisapprove={handleDisapprove}
          onViewAllClick={() => setFilters((prev: any) => ({ ...prev, category: "All", status: "All Status", vertical: "All" }))}
        />
      </div>
      {isModalOpen && (
        <CreateEntryModal onClose={() => setIsModalOpen(false)} onSubmit={handleAddEntry} />
      )}
    </div>
  );
}