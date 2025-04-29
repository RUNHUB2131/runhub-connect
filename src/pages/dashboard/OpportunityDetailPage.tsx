
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarDays, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - in a real app, this would come from an API or database
const opportunities = [
  {
    id: 1,
    type: "Sponsorship",
    title: "Sports Drink Brand Partnership",
    description: "Looking for running clubs to sponsor with our new electrolyte drink. We're seeking engaged running communities to partner with for our new product launch. Clubs will receive product samples for members and exclusive branding opportunities.",
    reward: "$500",
    deadline: "15 May",
    duration: "3 months",
    isNew: true,
    brandName: "HydrateMax",
    requirements: "Active club with at least 20 members, social media presence, willingness to share product feedback.",
    detailedDescription: "Our new electrolyte formula is designed specifically for runners, with optimal mineral content and natural flavors. We want to partner with clubs that can provide genuine feedback and help us promote the product through authentic word-of-mouth marketing."
  },
  {
    id: 2,
    type: "Event",
    title: "Community 5K Run",
    description: "Partner with our athletic wear brand for a community race event. We'll provide branded gear and organization support for your club to host a successful community run.",
    reward: "$1,200",
    deadline: "21 May",
    duration: "1 day event",
    isNew: true,
    brandName: "RunFit Apparel",
    requirements: "Club must be able to help organize a local event, recruit at least 50 participants, and have experience with community races.",
    detailedDescription: "This is a great opportunity to increase your club's visibility while receiving funding and support. We'll provide race bibs, finisher medals, and branded water stations. Your club will be prominently featured in all marketing materials."
  },
  {
    id: 3,
    type: "Product Testing",
    title: "Test New Running Shoes",
    description: "We need running clubs to test our latest trail running shoes and provide detailed feedback on performance, comfort, and durability.",
    reward: "$300 + free shoes",
    deadline: "30 May",
    duration: "2 weeks",
    isNew: false,
    brandName: "TrailBlaze",
    requirements: "Club members must collectively run at least 100 miles in the provided shoes and complete detailed feedback forms.",
    detailedDescription: "Your members will receive our unreleased trail running shoes designed for varied terrain. We're particularly interested in feedback on the new grip pattern and cushioning system. Each participant will get to keep their pair after providing feedback."
  },
  {
    id: 4,
    type: "Affiliate",
    title: "Running Gear Discount Program",
    description: "Offer your members exclusive discounts on our products with your club earning commission on all sales.",
    reward: "20% commission",
    deadline: "Open",
    duration: "Ongoing",
    isNew: false,
    brandName: "RunGear Pro",
    requirements: "Clubs must have a website or social media platform to share unique discount codes with members.",
    detailedDescription: "This long-term partnership opportunity allows your club to earn ongoing revenue while providing value to your members. Your club will receive a unique discount code to share, and you'll earn 20% commission on all sales made using the code."
  }
];

const OpportunityDetailPage: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [opportunity, setOpportunity] = useState<any>(null);
  const [applied, setApplied] = useState<boolean>(false);

  useEffect(() => {
    // In a real app, fetch data from an API
    const opportunityId = parseInt(id || '0');
    const foundOpportunity = opportunities.find(opp => opp.id === opportunityId);
    setOpportunity(foundOpportunity);
    
    // Check if already applied from localStorage
    const appliedOpportunities = JSON.parse(localStorage.getItem('appliedOpportunities') || '[]');
    const hasApplied = appliedOpportunities.some((appId: number) => appId === opportunityId);
    setApplied(hasApplied);
  }, [id]);

  const handleApply = () => {
    // In a real app, this would send data to an API
    const appliedOpportunities = JSON.parse(localStorage.getItem('appliedOpportunities') || '[]');
    if (!appliedOpportunities.includes(opportunity.id)) {
      appliedOpportunities.push(opportunity.id);
      localStorage.setItem('appliedOpportunities', JSON.stringify(appliedOpportunities));
      setApplied(true);
      
      toast({
        title: "Application Submitted",
        description: `You've successfully applied to "${opportunity.title}"`,
      });
    }
  };

  const handleRetractApplication = () => {
    // Remove from localStorage
    const appliedOpportunities = JSON.parse(localStorage.getItem('appliedOpportunities') || '[]');
    const updatedAppliedIds = appliedOpportunities.filter((appId: number) => appId !== opportunity.id);
    localStorage.setItem('appliedOpportunities', JSON.stringify(updatedAppliedIds));
    setApplied(false);
    
    // Show success toast
    toast({
      title: "Application Retracted",
      description: "Your application has been successfully retracted",
    });
  };
  
  if (!opportunity) {
    return (
      <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
        <p>Opportunity not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to opportunities
          </Button>
        </div>
        
        <Card className="bg-orange-100 border-0 overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
              <div>
                <Badge className="bg-orange-200 text-orange-800 hover:bg-orange-300 mb-2">
                  {opportunity.type}
                </Badge>
                <h1 className="text-3xl font-bold">{opportunity.title}</h1>
                <p className="text-gray-700 mt-2">By {opportunity.brandName}</p>
              </div>
              <div className="text-3xl font-bold text-orange-500">{opportunity.reward}</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <div className="text-sm text-gray-600">Deadline</div>
                  <div className="font-medium">{opportunity.deadline}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="font-medium">{opportunity.duration}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <div className="text-sm text-gray-600">Requirements</div>
                  <div className="font-medium truncate">Club requirements</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3">About this opportunity</h2>
            <p className="text-gray-700">
              {opportunity.detailedDescription}
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Requirements</h2>
            <p className="text-gray-700">
              {opportunity.requirements}
            </p>
          </section>
          
          <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 md:relative md:bg-transparent md:border-0 md:p-0 md:mt-10">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="text-2xl font-bold text-orange-500">{opportunity.reward}</div>
              {applied ? (
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-2"
                  onClick={handleRetractApplication}
                >
                  Retract Application
                </Button>
              ) : (
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
                  onClick={handleApply}
                >
                  Apply
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetailPage;
