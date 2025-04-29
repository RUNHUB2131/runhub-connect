
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from 'react-router-dom';

// Mock data for opportunities
const opportunities = [
  {
    id: 1,
    type: "Sponsorship",
    title: "Sports Drink Brand Partnership",
    description: "Looking for running clubs to sponsor with our new electrolyte drink",
    reward: "$500",
    deadline: "15 May",
    duration: "3 months",
    isNew: true,
    brandName: "HydrateMax"
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
    brandName: "RunFit Apparel"
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
    brandName: "TrailBlaze"
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
    brandName: "RunGear Pro"
  }
];

const OpportunitiesPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleCardClick = (id: number) => {
    navigate(`/dashboard/opportunities/${id}`);
  };
  
  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Explore Opportunities</h1>
        
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Featured Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.slice(0, 2).map((opportunity) => (
              <Card 
                key={opportunity.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-200"
                onClick={() => handleCardClick(opportunity.id)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">{opportunity.type}</Badge>
                    <span className="text-2xl font-bold text-orange-500">{opportunity.reward}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{opportunity.title}</h3>
                  <p className="text-gray-600 mb-4">{opportunity.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <CalendarDays className="h-4 w-4 mr-1" /> 
                    <span>Complete by {opportunity.deadline}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-1" /> 
                    <span>{opportunity.duration}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">By {opportunity.brandName}</span>
                    {opportunity.isNew && (
                      <Badge className="bg-green-100 text-green-800">New</Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">All Opportunities</h2>
          <div className="space-y-4">
            {opportunities.slice(2).map((opportunity) => (
              <Card 
                key={opportunity.id} 
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer bg-white border border-gray-200"
                onClick={() => handleCardClick(opportunity.id)}
              >
                <div className="p-4 flex flex-col md:flex-row md:items-center">
                  <div className="md:flex-1">
                    <div className="flex items-start mb-1">
                      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 mr-2">{opportunity.type}</Badge>
                      {opportunity.isNew && (
                        <Badge className="bg-green-100 text-green-800">New</Badge>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-1">{opportunity.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{opportunity.description}</p>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
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
                  
                  <div className="mt-3 md:mt-0 md:ml-4 flex items-center">
                    <span className="text-xl font-bold text-orange-500 mr-3">{opportunity.reward}</span>
                    <Button 
                      className="bg-orange-500 hover:bg-orange-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(opportunity.id);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
            Load More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesPage;
