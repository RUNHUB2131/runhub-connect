
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { LayoutDashboard, User, Search, FileText, MessageSquare } from 'lucide-react';

const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
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
    </Sidebar>
  );
};

export default DashboardSidebar;
