
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { LayoutDashboard, User, FilePlus, FileText, MessageSquare } from 'lucide-react';

const BrandDashboardSidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard/brand",
      icon: LayoutDashboard,
    },
    {
      title: "Brand Profile",
      path: "/dashboard/brand/profile",
      icon: User,
    },
    {
      title: "Post Opportunity",
      path: "/dashboard/brand/post-opportunity",
      icon: FilePlus,
    },
    {
      title: "Manage Opportunities",
      path: "/dashboard/brand/manage-opportunities",
      icon: FileText,
    },
    {
      title: "Messages",
      path: "/dashboard/brand/messages",
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
                  isActive={currentPath === item.path}
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

export default BrandDashboardSidebar;
