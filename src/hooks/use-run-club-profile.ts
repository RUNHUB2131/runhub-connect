
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { showErrorToast } from "@/utils/error-handling";
import { useState } from "react";

export function useRunClubProfile(profileId: string | null | undefined) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const query = useQuery({
    queryKey: ['runclub-profile', profileId],
    queryFn: async () => {
      if (!profileId) {
        throw new Error('Profile ID is required');
      }
      
      const result = await api.runclubs.fetchRunClubProfile(profileId);
      
      if (!result.success || result.error) {
        throw new Error(result.error || 'Failed to fetch run club profile');
      }
      
      return result.data;
    },
    enabled: !!profileId,
    retry: 1,
    onError: (error) => {
      setError(error instanceof Error ? error : new Error('An unknown error occurred'));
      showErrorToast(error);
    }
  });
  
  const refetch = async () => {
    setIsLoading(true);
    try {
      await query.refetch();
    } catch (err) {
      // Error will be handled by the onError callback in useQuery
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    profile: query.data,
    isLoading: query.isLoading || isLoading,
    error,
    refetch
  };
}
