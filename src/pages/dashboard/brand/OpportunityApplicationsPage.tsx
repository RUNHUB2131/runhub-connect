
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, User, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchOpportunityById, 
  fetchOpportunityApplications, 
  updateApplicationStatus 
} from '@/api/opportunityApi';
import RunClubProfileModal from '@/components/dashboard/RunClubProfileModal';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';

const OpportunityApplicationsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [acceptingApplicationId, setAcceptingApplicationId] = useState<string | null>(null);

  const { data: opportunity, isLoading: isLoadingOpportunity } = useQuery({
    queryKey: ['opportunity', id],
    queryFn: async () => {
      if (!id) throw new Error('Opportunity ID is required');
      const { data, error } = await fetchOpportunityById(id);
      if (error) throw new Error(error);
      return data;
    }
  });

  const { data: applications, isLoading: isLoadingApplications } = useQuery({
    queryKey: ['opportunity-applications', id],
    queryFn: async () => {
      if (!id) throw new Error('Opportunity ID is required');
      const { data, error } = await fetchOpportunityApplications(id);
      if (error) throw new Error(error);
      console.log("Fetched applications data:", data);
      return data || [];
    }
  });

  const handleViewProfile = (profileId: string) => {
    setSelectedProfileId(profileId);
  };

  const handleCloseModal = () => {
    setSelectedProfileId(null);
  };

  const handleAcceptApplication = async () => {
    if (!acceptingApplicationId) return;
    
    try {
      const { data, error } = await updateApplicationStatus(acceptingApplicationId, 'accepted');
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to accept the application. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Refresh the applications data
      queryClient.invalidateQueries({ queryKey: ['opportunity-applications', id] });
      
      toast({
        title: "Success",
        description: "Application has been accepted!",
        variant: "default",
      });
      
      setAcceptingApplicationId(null);
    } catch (error) {
      console.error("Error accepting application:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'accepted':
        return "bg-green-100 text-green-800";
      case 'rejected':
        return "bg-red-100 text-red-800";
      case 'pending':
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Safe accessor functions for profile data
  const getClubName = (application: any) => {
    return application?.profile?.club_name || 'Unnamed Run Club';
  };

  const getLocation = (application: any) => {
    return application?.profile?.location || 'Unknown';
  };

  if (isLoadingOpportunity || isLoadingApplications) {
    return (
      <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/brand/manage-opportunities')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to opportunities
          </Button>
        </div>

        {opportunity && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{opportunity.title} - Applications</h1>
            <p className="text-gray-600">{opportunity.description}</p>
          </div>
        )}

        {applications && applications.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>Run Club Applications ({applications.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Run Club</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application: any) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">
                        {getClubName(application)}
                      </TableCell>
                      <TableCell>{getLocation(application)}</TableCell>
                      <TableCell>
                        <span className={`capitalize px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(application.status)}`}>
                          {application.status}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(application.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewProfile(application.user_id)}
                          >
                            <User className="h-4 w-4 mr-1" />
                            View Profile
                          </Button>
                          
                          {application.status === 'pending' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-green-500 text-green-600 hover:bg-green-50"
                                  onClick={() => setAcceptingApplicationId(application.id)}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Accept
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Accept Application</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to accept this application from {getClubName(application)}?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleAcceptApplication}>Accept</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Applications Yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                There are no applications for this opportunity yet. Check back later.
              </p>
            </CardContent>
          </Card>
        )}

        {selectedProfileId && (
          <RunClubProfileModal
            profileId={selectedProfileId}
            isOpen={!!selectedProfileId}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default OpportunityApplicationsPage;
