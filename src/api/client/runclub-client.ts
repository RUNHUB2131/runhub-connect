
import { supabase } from "@/integrations/supabase/client";
import type { RunclubProfile } from "../types/opportunity.types";
import { ApiResult, createSuccessResult, createErrorResult, handleApiError } from "@/utils/error-handling";
import { Json } from "@/integrations/supabase/types";

// Helper to safely convert Json to Record<string, any>
function safeJsonToRecord(json: Json | null): Record<string, any> | null {
  if (json === null) return null;
  if (typeof json === 'object' && json !== null) return json as Record<string, any>;
  return null;
}

// Helper function to convert raw database result to typed RunclubProfile
function createTypedProfile(rawData: any, userId?: string): RunclubProfile {
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

/**
 * Fetches a run club profile by ID
 */
export async function fetchRunClubProfile(profileId: string): Promise<ApiResult<RunclubProfile>> {
  console.log("START: fetchRunClubProfile for ID:", profileId);
  
  if (!profileId) {
    console.error("No profile ID provided");
    return createErrorResult("No profile ID provided");
  }
  
  try {
    // Define the columns we want to select to avoid type issues
    const columns = "id, club_name, location, member_count, description, website, logo_url, community_data, social_media, created_at, updated_at, user_id";
    
    // First, check if this matches a profile in the runclub_profiles table directly
    const { data: rawData, error } = await supabase
      .from("runclub_profiles")
      .select(columns)
      .eq("id", profileId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching run club profile:", error);
      return createErrorResult("Failed to fetch run club profile: " + error.message);
    }
    
    if (rawData) {
      console.log("Found profile directly with id:", profileId);
      const typedProfile = createTypedProfile(rawData, profileId);
      return createSuccessResult(typedProfile);
    }
    
    // If not found by id, try using the id as user_id
    console.log("No direct profile match, trying as user_id");
    
    const { data: userIdRawData, error: userIdError } = await supabase
      .from("runclub_profiles")
      .select(columns)
      .eq("user_id", profileId)
      .maybeSingle();
      
    if (userIdError) {
      console.error("Error fetching run club profile by user_id:", userIdError);
    } else if (userIdRawData) {
      console.log("Found profile by user_id:", profileId);
      const typedProfile = createTypedProfile(userIdRawData, profileId);
      return createSuccessResult(typedProfile);
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
      return createErrorResult("Failed to fetch user profile: " + profileError.message);
    }
    
    if (!profileData) {
      console.error("No profile found for ID:", profileId);
      return createErrorResult("No profile found for the provided ID");
    }
    
    if (profileData.user_type !== 'runclub') {
      console.error("User is not a run club:", profileData);
      return createErrorResult("This user is not a run club");
    }
    
    // Now fetch the run club profile using the same ID
    const { data: runClubRawData, error: runClubError } = await supabase
      .from("runclub_profiles")
      .select(columns)
      .eq("id", profileId)
      .maybeSingle();
      
    if (runClubError) {
      console.error("Error fetching run club profile after user verification:", runClubError);
      return createErrorResult("Failed to fetch run club data: " + runClubError.message);
    }
    
    if (!runClubRawData) {
      console.error("Run club profile not found for verified user:", profileId);
      return createErrorResult("Run club profile not found for this user");
    }
    
    console.log("Found run club profile via user verification:", runClubRawData);
    const typedProfile = createTypedProfile(runClubRawData, profileId);
    return createSuccessResult(typedProfile);
    
  } catch (error) {
    return handleApiError<RunclubProfile>(error);
  }
}
