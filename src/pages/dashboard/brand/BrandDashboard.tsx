
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const BrandDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Welcome to RUNHUB! 🎉</h1>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Let's get you started</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium">Complete your brand profile</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium">Create your first sponsorship opportunity</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium">Review applications from run clubs</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              <Button 
                className="bg-gray-900 hover:bg-gray-800"
                onClick={() => navigate('/dashboard/brand/profile')}
              >
                Complete Your Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDashboard;
