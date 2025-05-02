
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

export async function fetchRunClubProfile(profileId: string) {
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
      throw new Error("Failed to fetch run club profile: " + error.message);
    }
    
    if (rawData) {
      console.log("Found profile directly with id:", profileId);
      // Use explicit property mapping instead of direct type assertion
      const typedProfile: RunclubProfile = {
        id: rawData.id,
        club_name: rawData.club_name,
        location: rawData.location,
        member_count: rawData.member_count,
        description: rawData.description,
        website: rawData.website,
        logo_url: rawData.logo_url,
        community_data: safeJsonToRecord(rawData.community_data),
        social_media: safeJsonToRecord(rawData.social_media),
        created_at: rawData.created_at,
        updated_at: rawData.updated_at,
        user_id: rawData.id // Use ID as user_id if specific user_id field doesn't exist
      };
      
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
      
      // Use explicit property mapping for type safety
      const typedProfile: RunclubProfile = {
        id: userIdRawData.id,
        club_name: userIdRawData.club_name,
        location: userIdRawData.location,
        member_count: userIdRawData.member_count,
        description: userIdRawData.description,
        website: userIdRawData.website,
        logo_url: userIdRawData.logo_url,
        community_data: safeJsonToRecord(userIdRawData.community_data),
        social_media: safeJsonToRecord(userIdRawData.social_media),
        created_at: userIdRawData.created_at,
        updated_at: userIdRawData.updated_at,
        user_id: profileId // Use the profileId as user_id since that's what matched
      };
      
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
      throw new Error("Failed to fetch user profile: " + profileError.message);
    }
    
    if (!profileData) {
      console.error("No profile found for ID:", profileId);
      throw new Error("No profile found for the provided ID");
    }
    
    if (profileData.user_type !== 'runclub') {
      console.error("User is not a run club:", profileData);
      throw new Error("This user is not a run club");
    }
    
    // Now fetch the run club profile using the same ID
    const { data: runClubRawData, error: runClubError } = await supabase
      .from("runclub_profiles")
      .select("*")
      .eq("id", profileId)
      .maybeSingle();
      
    if (runClubError) {
      console.error("Error fetching run club profile after user verification:", runClubError);
      throw new Error("Failed to fetch run club data: " + runClubError.message);
    }
    
    if (!runClubRawData) {
      console.error("Run club profile not found for verified user:", profileId);
      throw new Error("Run club profile not found for this user");
    }
    
    console.log("Found run club profile via user verification:", runClubRawData);
    
    // Use explicit property mapping for type safety
    const typedProfile: RunclubProfile = {
      id: runClubRawData.id,
      club_name: runClubRawData.club_name,
      location: runClubRawData.location,
      member_count: runClubRawData.member_count,
      description: runClubRawData.description,
      website: runClubRawData.website,
      logo_url: runClubRawData.logo_url,
      community_data: safeJsonToRecord(runClubRawData.community_data),
      social_media: safeJsonToRecord(runClubRawData.social_media),
      created_at: runClubRawData.created_at,
      updated_at: runClubRawData.updated_at,
      user_id: profileId // Use the profileId as user_id
    };
    
    return { data: typedProfile, error: null };
    
  } catch (error: any) {
    console.error("Error in fetchRunClubProfile:", error);
    return { data: null, error: error.message };
  }
}
