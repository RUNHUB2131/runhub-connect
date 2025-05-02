
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { fetchOpportunityById, fetchOpportunityApplications } from '@/api/opportunityApi';
import { Opportunity, Application } from '@/api/types/opportunity.types';
import { useApplicationStatus } from './use-application-status';

export function useApplications(opportunityId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  
  const { 
    updatingApplicationId, 
    handleAcceptApplication, 
    handleRejectApplication 
  } = useApplicationStatus(opportunityId);

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
    updatingApplicationId,
    handleRefresh,
    handleViewProfile,
    handleAcceptApplication,
    handleRejectApplication,
    handleCloseModal
  };
}
