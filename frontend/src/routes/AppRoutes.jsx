import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import InventoryPage from "../pages/InventoryPage";
import OxygenInventoryPage from "../pages/OxygenInventoryPage";
import EmergencyRequestsPage from "../pages/EmergencyRequestsPage";
import ReportsAnalyticsPage from "../pages/ReportsAnalyticsPage";
import NotFoundPage from "../pages/NotFoundPage";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><DashboardLayout><InventoryPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/oxygen" element={<ProtectedRoute><DashboardLayout><OxygenInventoryPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/requests" element={<ProtectedRoute><DashboardLayout><EmergencyRequestsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><DashboardLayout><ReportsAnalyticsPage /></DashboardLayout></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
