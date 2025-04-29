
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, FileText } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { deleteApplication, fetchUserApplications } from '@/api/opportunityApi';

const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch applications data
  const { 
    data: applications, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data, error } = await fetchUserApplications();
      if (error) throw new Error(error);
      return data || [];
    }
  });

  const handleViewDetails = (id: string) => {
    navigate(`/dashboard/opportunities/${id}`);
  };

  const handleRetractApplication = async (applicationId: string) => {
    try {
      const { error } = await deleteApplication(applicationId);
      
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
        return;
      }
      
      // Refetch applications
      refetch();
      
      // Show success toast
      toast({
        title: "Application Retracted",
        description: "Your application has been successfully retracted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Separate applications by status
  const pendingApplications = applications?.filter(
    (app: any) => app.status === 'pending'
  ) || [];
  
  const acceptedApplications = applications?.filter(
    (app: any) => app.status === 'accepted'
  ) || [];

  if (isLoading) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Applications</h1>
          <p>Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Applications</h1>
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>
                There was an error loading your applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => refetch()}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  const renderApplicationList = (appList: any[], title: string, emptyMessage: string) => {
    if (appList.length === 0) {
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{emptyMessage}</CardDescription>
          </CardHeader>
        </Card>
      );
    }
    
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="space-y-4">
          {appList.map((application: any) => {
            const opportunity = application.opportunity;
            return (
              <Card 
                key={application.id}
                className="overflow-hidden bg-white border border-gray-200"
              >
                <div className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="md:flex-1">
                      <div className="flex items-start mb-1">
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 mr-2">
                          {opportunity.type}
                        </Badge>
                        <Badge className={`${
                          application.status === 'accepted' 
                            ? 'bg-green-100 text-green-800' 
                            : application.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {application.status === 'pending' ? 'Pending Review' : 
                            application.status === 'accepted' ? 'Accepted' : 'Rejected'}
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
                          <span className="font-medium">Applied on {new Date(application.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 md:mt-0 md:ml-4 flex items-center space-x-2">
                      <span className="text-lg font-bold text-orange-500">{opportunity.reward}</span>
                      <div className="flex space-x-2">
                        <Button 
                          className="bg-orange-500 hover:bg-orange-600"
                          onClick={() => handleViewDetails(opportunity.id)}
                        >
                          View Details
                        </Button>
                        {application.status === 'pending' && (
                          <Button 
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleRetractApplication(application.id)}
                          >
                            Retract
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Applications</h1>
        
        {applications && applications.length > 0 ? (
          <>
            {renderApplicationList(
              pendingApplications, 
              "Pending Applications", 
              "You don't have any pending applications."
            )}
            
            {renderApplicationList(
              acceptedApplications, 
              "Accepted Applications", 
              "You don't have any accepted applications yet."
            )}
          </>
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
