
/**
 * Centralized query keys for React Query
 * This helps with consistent cache invalidation and prefetching
 */

export const queryKeys = {
  // Profile related queries
  profiles: {
    all: ['profiles'] as const,
    runclub: (id: string | null) => ['runclub-profile', id] as const,
    brand: (id: string | null) => ['brand-profile', id] as const
  },
  
  // Opportunity related queries
  opportunities: {
    all: ['opportunities'] as const,
    detail: (id: string | undefined) => ['opportunity', id] as const,
    applications: (id: string | undefined) => ['opportunity-applications', id] as const,
    brand: ['brand-opportunities'] as const
  },
  
  // Application related queries
  applications: {
    user: ['applications', 'user'] as const,
    status: (opportunityId: string, applicationId: string) => 
      ['applications', opportunityId, applicationId, 'status'] as const
  }
};
