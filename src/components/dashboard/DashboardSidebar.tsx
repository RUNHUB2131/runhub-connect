
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { LayoutDashboard, User, Search, FileText, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { signOut } = useAuth();
  const { toast } = useToast();
  
  // Check if the current path starts with a specific base path
  const isPathActive = (basePath: string) => {
    return currentPath === basePath || currentPath.startsWith(`${basePath}/`);
  };
  
  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Profile",
      path: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Browse Opportunities",
      path: "/dashboard/opportunities",
      icon: Search,
    },
    {
      title: "My Applications",
      path: "/dashboard/applications",
      icon: FileText,
    },
    {
      title: "Messages",
      path: "/dashboard/messages",
      icon: MessageSquare,
      disabled: true,
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing out",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Sidebar>
      <SidebarContent>
        <div className="py-2">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild
                  isActive={isPathActive(item.path) || 
                           (item.path === "/dashboard/opportunities" && currentPath === "/dashboard")}
                  tooltip={item.title}
                  aria-disabled={item.disabled}
                  className={item.disabled ? "opacity-50 pointer-events-none" : ""}
                >
                  <Link to={item.disabled ? "#" : item.path}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
