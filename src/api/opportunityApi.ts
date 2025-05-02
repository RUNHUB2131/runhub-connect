
// Re-export all functions from the smaller files to maintain API compatibility
// Import from our new unified client
import { api } from './client';

// Opportunity management functions
export { 
  createOpportunity,
  fetchBrandOpportunities,
  fetchAllOpportunities,
  fetchOpportunityById,
  deleteOpportunity
} from './client/opportunity-client';

// Application management functions
export {
  applyForOpportunity,
  fetchUserApplications,
  deleteApplication
} from './client/application-client';

// Opportunity applications management functions
export {
  fetchOpportunityApplications,
  updateApplicationStatus
} from './client/opportunity-client';

// Run club profile management functions
export {
  fetchRunClubProfile
} from './client/runclub-client';

// Re-export types
export type { Application, RunclubProfile, Opportunity } from './types/opportunity.types';

// Export the unified API client for new code
export { api };
