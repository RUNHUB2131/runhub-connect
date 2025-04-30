
// Re-export all functions from the smaller files to maintain API compatibility

// Opportunity management functions
export { 
  createOpportunity,
  fetchBrandOpportunities,
  fetchAllOpportunities,
  fetchOpportunityById
} from './opportunityManagement';

// Application management functions
export {
  applyForOpportunity,
  fetchUserApplications,
  deleteApplication
} from './applicationManagement';

// Opportunity applications management functions
export {
  fetchOpportunityApplications,
  updateApplicationStatus
} from './opportunityApplicationsManager';

// Run club profile management functions
export {
  fetchRunClubProfile
} from './runClubProfileManager';

// Re-export types
export type { Application, RunclubProfile, Opportunity } from './types/opportunity.types';
