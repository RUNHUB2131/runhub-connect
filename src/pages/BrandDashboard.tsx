
import { Outlet } from "react-router-dom";
import BrandDashboardSidebar from "@/components/dashboard/BrandDashboardSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

const BrandDashboardLayout = () => {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <BrandDashboardSidebar />
        <Outlet />
      </div>
    </ProtectedRoute>
  );
};

export default BrandDashboardLayout;
