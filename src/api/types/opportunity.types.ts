
// Define interfaces for our data structures
export interface Application {
  id: string;
  opportunity_id: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  runclub_profile?: RunclubProfile | null;
}

export interface RunclubProfile {
  id: string;
  club_name: string | null;
  location: string | null;
  member_count: number | null;
  description: string | null;
  website: string | null;
  logo_url: string | null;
  community_data: Record<string, any> | null;
  social_media: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  detailed_description?: string | null;
  type: string;
  reward: string;
  deadline: string;
  duration: string;
  requirements?: string | null;
  brand_id: string;
  is_active: boolean;
  is_new: boolean;
  created_at: string;
  updated_at: string;
}
