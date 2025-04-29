
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const Dashboard: React.FC = () => {
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container-custom flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">RC</span>
            </div>
            <span className="font-bold text-lg text-navy-800">RunConnect</span>
          </div>
          <Button variant="outline" onClick={handleLogout}>Log out</Button>
        </div>
      </nav>
      
      <div className="container-custom py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <p className="text-gray-600 mb-6">
            Welcome to your RunConnect dashboard. This is a placeholder for your personalized dashboard.
          </p>
          
          <div className="p-8 border border-dashed border-gray-300 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
            <p className="text-gray-600">
              Your personalized dashboard is under construction. Check back soon for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
