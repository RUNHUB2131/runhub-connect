
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/api/client';

export function useApplicationStatus(opportunityId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [updatingApplicationId, setUpdatingApplicationId] = useState<string | null>(null);

  const handleAcceptApplication = async (applicationId: string) => {
    if (!applicationId) return;
    
    try {
      setUpdatingApplicationId(applicationId);
      const { data, error } = await api.opportunities.updateApplicationStatus(applicationId, 'accepted');
      
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
      setUpdatingApplicationId(null);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    if (!applicationId) return;
    
    try {
      setUpdatingApplicationId(applicationId);
      const { data, error } = await api.opportunities.updateApplicationStatus(applicationId, 'rejected');
      
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
      setUpdatingApplicationId(null);
    }
  };

  return {
    updatingApplicationId,
    handleAcceptApplication,
    handleRejectApplication
  };
}
