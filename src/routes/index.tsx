import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import DashboardPage from "../pages/DashboardPage";
import ApprovalsPage from "../pages/ApprovalsPage";
import MentoringPage from "../pages/MentoringPage";
import ForumPage from "../pages/ForumPage";
import BatchSchedulePage from "../pages/BatchSchedulePage";
import FacultyPage from "../pages/FacultyPage";
import ReportsPage from "../pages/ReportsPage";
import SettingsPage from "../pages/SettingsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/approvals" element={<ApprovalsPage />} />
        <Route path="/mentoring" element={<MentoringPage />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/batch-schedule" element={<BatchSchedulePage />} />
        <Route path="/faculty" element={<FacultyPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}