
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Plus, Edit, Eye } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchBrandOpportunities } from "@/api/opportunityApi";

const ManageOpportunitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: opportunities, isLoading, error } = useQuery({
    queryKey: ['brandOpportunities'],
    queryFn: async () => {
      const result = await fetchBrandOpportunities();
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
  });

  if (error) {
    toast({
      title: "Error loading opportunities",
      description: error.message,
      variant: "destructive",
    });
  }
  
  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Opportunities</h1>
          <Button 
            onClick={() => navigate('/dashboard/brand/post-opportunity')}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Opportunity
          </Button>
        </div>
        
        {isLoading ? (
          <Card className="p-6 text-center">
            <p>Loading opportunities...</p>
          </Card>
        ) : opportunities && opportunities.length > 0 ? (
          <div className="space-y-4">
            {opportunities.map((opportunity: any) => (
              <Card key={opportunity.id} className="overflow-hidden">
                <div className="p-4 flex flex-col md:flex-row md:items-center">
                  <div className="md:flex-1">
                    <div className="flex items-start mb-1">
                      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 mr-2">{opportunity.type}</Badge>
                      {opportunity.is_new && (
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
                        <span className="text-green-600 font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 md:mt-0 md:ml-4 flex items-center">
                    <span className="text-xl font-bold text-orange-500 mr-3">{opportunity.reward}</span>
                    <div className="space-x-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigate(`/dashboard/brand/opportunity/${opportunity.id}/applications`);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Applications
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Edit opportunity logic (to be implemented)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
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
              <CardTitle>No Opportunities Yet</CardTitle>
              <CardDescription>Get started by creating your first opportunity</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Create your first sponsorship opportunity to connect with run clubs.
              </p>
              <Button 
                onClick={() => navigate('/dashboard/brand/post-opportunity')}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Opportunity
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ManageOpportunitiesPage;
