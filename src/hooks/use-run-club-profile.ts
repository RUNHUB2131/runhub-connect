
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { RunclubProfile } from '@/api/types/opportunity.types';
import { showErrorToast } from '@/utils/error-handling';

export function useRunClubProfile(profileId: string | null) {
  const [error, setError] = useState<Error | null>(null);

  const {
    data: profile,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['runclub-profile', profileId],
    queryFn: async () => {
      if (!profileId) return undefined;

      try {
        const response = await api.runclubs.fetchRunClubProfile(profileId);

        if (response.error) {
          const err = new Error(response.error);
          setError(err);
          showErrorToast(err);
          return undefined;
        }

        return response.data as RunclubProfile;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch profile');
        setError(error);
        showErrorToast(error);
        return undefined;
      }
    },
    enabled: !!profileId
  });

  return {
    profile,
    isLoading,
    error,
    refetch
  };
}
