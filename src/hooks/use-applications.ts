
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchOpportunityById, 
  fetchOpportunityApplications, 
  updateApplicationStatus,
  Application,
  Opportunity
} from '@/api/opportunityApi';

export function useApplications(opportunityId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [acceptingApplicationId, setAcceptingApplicationId] = useState<string | null>(null);
  const [rejectingApplicationId, setRejectingApplicationId] = useState<string | null>(null);

  const { data: opportunity, isLoading: isLoadingOpportunity } = useQuery({
    queryKey: ['opportunity', opportunityId],
    queryFn: async () => {
      if (!opportunityId) throw new Error('Opportunity ID is required');
      const { data, error } = await fetchOpportunityById(opportunityId);
      if (error) throw new Error(error);
      return data as Opportunity;
    },
    enabled: !!opportunityId
  });

  const { 
    data: applications, 
    isLoading: isLoadingApplications, 
    error: applicationsError, 
    refetch 
  } = useQuery({
    queryKey: ['opportunity-applications', opportunityId],
    queryFn: async () => {
      if (!opportunityId) throw new Error('Opportunity ID is required');
      console.log("Fetching applications for opportunity ID:", opportunityId);
      const { data, error } = await fetchOpportunityApplications(opportunityId);
      if (error) throw new Error(error);
      console.log("Fetched applications data:", data);
      return data as Application[] || [];
    },
    retry: 1,
    enabled: !!opportunityId
  });

  // Debug applications data
  useEffect(() => {
    if (applications) {
      console.log("Applications in hook:", applications);
      applications.forEach(app => {
        if (!app.runclub_profile) {
          console.warn("Application missing runclub_profile:", app.id);
        } else {
          console.log(`Application ${app.id} has profile:`, app.runclub_profile);
        }
      });
    }
  }, [applications]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Refreshed",
        description: "Application data has been refreshed",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Error",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewProfile = (profileId: string) => {
    if (!profileId) {
      toast({
        title: "Error",
        description: "Profile ID is missing",
        variant: "destructive",
      });
      return;
    }
    console.log("Viewing profile:", profileId);
    setSelectedProfileId(profileId);
  };

  const handleAcceptApplication = async (applicationId: string) => {
    if (!applicationId) return;
    
    try {
      setAcceptingApplicationId(applicationId);
      const { data, error } = await updateApplicationStatus(applicationId, 'accepted');
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to accept the application. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Refresh the applications data
      queryClient.invalidateQueries({ queryKey: ['opportunity-applications', opportunityId] });
      
      toast({
        title: "Success",
        description: "Application has been accepted!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error accepting application:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAcceptingApplicationId(null);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    if (!applicationId) return;
    
    try {
      setRejectingApplicationId(applicationId);
      const { data, error } = await updateApplicationStatus(applicationId, 'rejected');
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to reject the application. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Refresh the applications data
      queryClient.invalidateQueries({ queryKey: ['opportunity-applications', opportunityId] });
      
      toast({
        title: "Application Rejected",
        description: "Application has been rejected.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRejectingApplicationId(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedProfileId(null);
  };

  return {
    opportunity,
    applications,
    isLoadingOpportunity,
    isLoadingApplications,
    applicationsError,
    isRefreshing,
    selectedProfileId,
    acceptingApplicationId,
    rejectingApplicationId,
    handleRefresh,
    handleViewProfile,
    handleAcceptApplication,
    handleRejectApplication,
    handleCloseModal
  };
}
