
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, FileText, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

// Mock data for opportunities
const allOpportunities = [
  {
    id: 1,
    type: "Sponsorship",
    title: "Sports Drink Brand Partnership",
    description: "Looking for running clubs to sponsor with our new electrolyte drink",
    reward: "$500",
    deadline: "15 May",
    duration: "3 months",
    isNew: true,
    brandName: "HydrateMax",
    status: "Pending Review"
  },
  {
    id: 2,
    type: "Event",
    title: "Community 5K Run",
    description: "Partner with our athletic wear brand for a community race event",
    reward: "$1,200",
    deadline: "21 May",
    duration: "1 day event",
    isNew: true,
    brandName: "RunFit Apparel",
    status: "Pending Review"
  },
  {
    id: 3,
    type: "Product Testing",
    title: "Test New Running Shoes",
    description: "We need running clubs to test our latest trail running shoes",
    reward: "$300 + free shoes",
    deadline: "30 May",
    duration: "2 weeks",
    isNew: false,
    brandName: "TrailBlaze",
    status: "Pending Review"
  },
  {
    id: 4,
    type: "Affiliate",
    title: "Running Gear Discount Program",
    description: "Offer your members exclusive discounts on our products",
    reward: "20% commission",
    deadline: "Open",
    duration: "Ongoing",
    isNew: false,
    brandName: "RunGear Pro",
    status: "Pending Review"
  }
];

const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [appliedOpportunities, setAppliedOpportunities] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this would be fetched from an API
    const appliedIds = JSON.parse(localStorage.getItem('appliedOpportunities') || '[]');
    const opportunities = allOpportunities.filter(opp => appliedIds.includes(opp.id));
    setAppliedOpportunities(opportunities);
  }, []);

  const handleViewDetails = (id: number) => {
    navigate(`/dashboard/opportunities/${id}`);
  };

  const handleRetractApplication = (id: number) => {
    // Remove from localStorage
    const appliedIds = JSON.parse(localStorage.getItem('appliedOpportunities') || '[]');
    const updatedAppliedIds = appliedIds.filter((appId: number) => appId !== id);
    localStorage.setItem('appliedOpportunities', JSON.stringify(updatedAppliedIds));
    
    // Update the UI
    setAppliedOpportunities(prevOpportunities => 
      prevOpportunities.filter(opp => opp.id !== id)
    );
    
    // Show success toast
    toast({
      title: "Application Retracted",
      description: "Your application has been successfully retracted",
    });
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Applications</h1>
        
        {appliedOpportunities.length > 0 ? (
          <div className="space-y-4">
            {appliedOpportunities.map(opportunity => (
              <Card 
                key={opportunity.id}
                className="overflow-hidden bg-white border border-gray-200"
              >
                <div className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="md:flex-1">
                      <div className="flex items-start mb-1">
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 mr-2">
                          {opportunity.type}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800">
                          {opportunity.status}
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-1">{opportunity.title}</h3>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                        <div className="flex items-center">
                          <CalendarDays className="h-3 w-3 mr-1" /> 
                          <span>Complete by {opportunity.deadline}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> 
                          <span>{opportunity.duration}</span>
                        </div>
                        
                        <div>
                          <span className="font-medium">By {opportunity.brandName}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 md:mt-0 md:ml-4 flex items-center space-x-2">
                      <span className="text-lg font-bold text-orange-500">{opportunity.reward}</span>
                      <Button 
                        className="bg-orange-500 hover:bg-orange-600"
                        onClick={() => handleViewDetails(opportunity.id)}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleRetractApplication(opportunity.id)}
                      >
                        <X className="mr-1 h-4 w-4" /> Retract
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Applications Yet</CardTitle>
              <CardDescription>
                Browse opportunities and apply to see your applications here
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button 
                className="mt-2 bg-orange-500 hover:bg-orange-600"
                onClick={() => navigate('/dashboard/opportunities')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Browse Opportunities
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
