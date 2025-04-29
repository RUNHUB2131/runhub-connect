
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarDays, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const OpportunityDetailPage: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applied, setApplied] = useState<boolean>(false);

  // Fetch opportunity details
  const { data: opportunity, isLoading, error } = useQuery({
    queryKey: ['opportunity', id],
    queryFn: async () => {
      if (!id) throw new Error('No opportunity ID provided');
      
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw new Error(error.message);
      if (!data) throw new Error('Opportunity not found');
      
      return data;
    },
  });

  // Check if already applied from localStorage
  React.useEffect(() => {
    if (!id) return;
    
    const appliedOpportunities = JSON.parse(localStorage.getItem('appliedOpportunities') || '[]');
    const hasApplied = appliedOpportunities.some((appId: string) => appId === id);
    setApplied(hasApplied);
  }, [id]);

  const handleApply = () => {
    if (!opportunity || !id) return;
    
    // In a real app, this would send data to an API
    const appliedOpportunities = JSON.parse(localStorage.getItem('appliedOpportunities') || '[]');
    if (!appliedOpportunities.includes(id)) {
      appliedOpportunities.push(id);
      localStorage.setItem('appliedOpportunities', JSON.stringify(appliedOpportunities));
      setApplied(true);
      
      toast({
        title: "Application Submitted",
        description: `You've successfully applied to "${opportunity.title}"`,
      });
    }
  };

  const handleRetractApplication = () => {
    if (!id) return;
    
    // Remove from localStorage
    const appliedOpportunities = JSON.parse(localStorage.getItem('appliedOpportunities') || '[]');
    const updatedAppliedIds = appliedOpportunities.filter((appId: string) => appId !== id);
    localStorage.setItem('appliedOpportunities', JSON.stringify(updatedAppliedIds));
    setApplied(false);
    
    // Show success toast
    toast({
      title: "Application Retracted",
      description: "Your application has been successfully retracted",
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
        <p>Loading opportunity details...</p>
      </div>
    );
  }

  if (error || !opportunity) {
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
                <p className="text-gray-700 mt-2">By Brand</p>
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
              {opportunity.detailed_description || opportunity.description}
            </p>
          </section>
          
          {opportunity.requirements && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Requirements</h2>
              <p className="text-gray-700">
                {opportunity.requirements}
              </p>
            </section>
          )}
          
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
