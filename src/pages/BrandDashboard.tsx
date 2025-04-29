
import { Outlet } from "react-router-dom";
import BrandDashboardSidebar from "@/components/dashboard/BrandDashboardSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";

const BrandDashboardLayout = () => {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <BrandDashboardSidebar />
          <Outlet />
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default BrandDashboardLayout;
