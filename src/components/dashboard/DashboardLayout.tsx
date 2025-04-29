
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import ProtectedRoute from "../ProtectedRoute";
import { SidebarProvider } from "../ui/sidebar";

const DashboardLayout = () => {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <DashboardSidebar />
          <Outlet />
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
