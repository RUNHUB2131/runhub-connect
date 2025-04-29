
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import UserTypeSelection from "./pages/UserTypeSelection";

// Run Club Dashboard pages
import DashboardLayout from "./components/dashboard/DashboardLayout";
import ProfilePage from "./pages/dashboard/ProfilePage";
import OpportunitiesPage from "./pages/dashboard/OpportunitiesPage";
import OpportunityDetailPage from "./pages/dashboard/OpportunityDetailPage";
import ApplicationsPage from "./pages/dashboard/ApplicationsPage";
import MessagesPage from "./pages/dashboard/MessagesPage";

// Brand Dashboard pages
import BrandDashboardLayout from "./pages/BrandDashboard";
import BrandDashboard from "./pages/dashboard/brand/BrandDashboard";
import BrandProfilePage from "./pages/dashboard/brand/BrandProfilePage";
import PostOpportunityPage from "./pages/dashboard/brand/PostOpportunityPage";
import ManageOpportunitiesPage from "./pages/dashboard/brand/ManageOpportunitiesPage";
import BrandMessagesPage from "./pages/dashboard/brand/BrandMessagesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/user-type" element={<UserTypeSelection />} />
          <Route path="/auth/:action" element={<AuthPage />} />
          
          {/* Run Club Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<OpportunitiesPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="opportunities" element={<OpportunitiesPage />} />
            <Route path="opportunities/:id" element={<OpportunityDetailPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="messages" element={<MessagesPage />} />
          </Route>
          
          {/* Brand Dashboard Routes */}
          <Route path="/dashboard/brand" element={<BrandDashboardLayout />}>
            <Route index element={<BrandDashboard />} />
            <Route path="profile" element={<BrandProfilePage />} />
            <Route path="post-opportunity" element={<PostOpportunityPage />} />
            <Route path="manage-opportunities" element={<ManageOpportunitiesPage />} />
            <Route path="messages" element={<BrandMessagesPage />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
