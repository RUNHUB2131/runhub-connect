
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import ProtectedRoute from "../ProtectedRoute";

const DashboardLayout = () => {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <Outlet />
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
