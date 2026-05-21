import { useApp } from "../context/AppContext";
import { CheckCircle2 } from "lucide-react";

export function Toast() {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="toast">
      <CheckCircle2 size={14} />
      <span>{toastMessage}</span>
    </div>
  );
}