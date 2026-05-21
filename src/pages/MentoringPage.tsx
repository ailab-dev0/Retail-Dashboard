import { useState } from "react";
import { MentoringGamePlanView } from "../components/MentoringGamePlanView";
import { useApp } from "../context/AppContext";
import { CreateEntryModal } from "../components/CreateEntryModal";

export default function MentoringPage() {
  const { entries, handleAddEntry } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <MentoringGamePlanView entries={entries} onAddSlot={handleAddEntry} />
      {isModalOpen && (
        <CreateEntryModal onClose={() => setIsModalOpen(false)} onSubmit={handleAddEntry} />
      )}
    </>
  );
}