
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import BrandDashboardSidebar from "@/components/dashboard/BrandDashboardSidebar";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const BrandDashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    // For demo, just simulate a logout
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <BrandDashboardSidebar />
        
        <div className="flex flex-col w-full">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-white border-b">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="font-bold text-xl text-blue-600">RUNHUB</div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  onClick={handleLogout}
                >
                  <User className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>
          
          {/* Main Content - Rendered by the child route */}
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BrandDashboardLayout;
