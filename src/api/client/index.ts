
import * as opportunityClient from './opportunity-client';
import * as applicationClient from './application-client';
import * as runclubClient from './runclub-client';

export const api = {
  opportunities: opportunityClient,
  applications: applicationClient,
  runclubs: runclubClient
};

export type { ApiResult } from '@/utils/error-handling';
