
import { supabase } from "@/integrations/supabase/client";
import type { RunclubProfile } from "./types/opportunity.types";
import { Json } from "@/integrations/supabase/types";

// Helper to safely convert Json to Record<string, any>
function safeJsonToRecord(json: Json | null): Record<string, any> | null {
  if (json === null) return null;
  if (typeof json === 'object' && json !== null) return json as Record<string, any>;
  return null;
}

// Type guard function to validate if an object is a RunclubProfile
function isRunclubProfileShape(obj: unknown): obj is RunclubProfile {
  if (!obj || typeof obj !== 'object') return false;
  
  const profile = obj as Record<string, unknown>;
  return (
    ('id' in profile && typeof profile.id === 'string') ||
    ('user_id' in profile && typeof profile.user_id === 'string')
  );
}

// Helper function to convert raw database result to typed RunclubProfile
function createTypedProfile(rawData: any, userId?: string): RunclubProfile | null {
  if (!rawData) return null;
  
  return {
    id: rawData.id ?? '',
    club_name: rawData.club_name ?? '',
    location: rawData.location ?? '',
    member_count: typeof rawData.member_count === 'number' ? rawData.member_count : 0,
    description: rawData.description ?? '',
    website: rawData.website ?? '',
    logo_url: rawData.logo_url ?? '',
    community_data: safeJsonToRecord(rawData.community_data),
    social_media: safeJsonToRecord(rawData.social_media),
    created_at: rawData.created_at ?? new Date().toISOString(),
    updated_at: rawData.updated_at ?? new Date().toISOString(),
    user_id: userId ?? rawData.user_id ?? rawData.id ?? ''
  };
}

// Define explicit return type for the function
type FetchProfileResult = {
  data: RunclubProfile | null;
  error: string | null;
};

export async function fetchRunClubProfile(profileId: string): Promise<FetchProfileResult> {
  console.log("START: fetchRunClubProfile for ID:", profileId);
  
  if (!profileId) {
    console.error("No profile ID provided");
    return { data: null, error: "No profile ID provided" };
  }
  
  try {
    // First, check if this matches a profile in the runclub_profiles table directly
    const { data: rawData, error } = await supabase
      .from("runclub_profiles")
      .select("*")
      .eq("id", profileId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching run club profile:", error);
      return { data: null, error: "Failed to fetch run club profile: " + error.message };
    }
    
    if (rawData) {
      console.log("Found profile directly with id:", profileId);
      const typedProfile = createTypedProfile(rawData, profileId);
      return { data: typedProfile, error: null };
    }
    
    // If not found by id, try using the id as user_id
    console.log("No direct profile match, trying as user_id");
    
    const { data: userIdRawData, error: userIdError } = await supabase
      .from("runclub_profiles")
      .select("*")
      .eq("user_id", profileId)
      .maybeSingle();
      
    if (userIdError) {
      console.error("Error fetching run club profile by user_id:", userIdError);
    } else if (userIdRawData) {
      console.log("Found profile by user_id:", profileId);
      const typedProfile = createTypedProfile(userIdRawData, profileId);
      return { data: typedProfile, error: null };
    }
    
    // If still not found, check the profiles table to determine user_type
    console.log("No profile match, checking profiles table");
    
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, user_type")
      .eq("id", profileId)
      .maybeSingle();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return { data: null, error: "Failed to fetch user profile: " + profileError.message };
    }
    
    if (!profileData) {
      console.error("No profile found for ID:", profileId);
      return { data: null, error: "No profile found for the provided ID" };
    }
    
    if (profileData.user_type !== 'runclub') {
      console.error("User is not a run club:", profileData);
      return { data: null, error: "This user is not a run club" };
    }
    
    // Now fetch the run club profile using the same ID
    const { data: runClubRawData, error: runClubError } = await supabase
      .from("runclub_profiles")
      .select("*")
      .eq("id", profileId)
      .maybeSingle();
      
    if (runClubError) {
      console.error("Error fetching run club profile after user verification:", runClubError);
      return { data: null, error: "Failed to fetch run club data: " + runClubError.message };
    }
    
    if (!runClubRawData) {
      console.error("Run club profile not found for verified user:", profileId);
      return { data: null, error: "Run club profile not found for this user" };
    }
    
    console.log("Found run club profile via user verification:", runClubRawData);
    const typedProfile = createTypedProfile(runClubRawData, profileId);
    return { data: typedProfile, error: null };
    
  } catch (error: any) {
    console.error("Error in fetchRunClubProfile:", error);
    return { data: null, error: error.message };
  }
}
