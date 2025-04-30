
import { supabase } from "@/integrations/supabase/client";
import type { RunclubProfile } from "./types/opportunity.types";

export async function fetchRunClubProfile(profileId: string) {
  console.log("START: fetchRunClubProfile for ID:", profileId);
  
  if (!profileId) {
    console.error("No profile ID provided");
    return { data: null, error: "No profile ID provided" };
  }
  
  try {
    // First, check if this matches a profile in the runclub_profiles table directly
    const { data, error } = await supabase
      .from("runclub_profiles")
      .select("*")
      .eq("id", profileId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching run club profile:", error);
      throw new Error("Failed to fetch run club profile: " + error.message);
    }
    
    if (data) {
      console.log("Found profile directly with id:", profileId);
      return { data: data as RunclubProfile, error: null };
    }
    
    // If not found by id, try using the id as user_id
    console.log("No direct profile match, trying as user_id");
    
    const { data: userIdData, error: userIdError } = await supabase
      .from("runclub_profiles")
      .select("*")
      .eq("user_id", profileId)
      .maybeSingle();
      
    if (userIdError) {
      console.error("Error fetching run club profile by user_id:", userIdError);
    } else if (userIdData) {
      console.log("Found profile by user_id:", profileId);
      return { data: userIdData as RunclubProfile, error: null };
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
    const { data: runClubData, error: runClubError } = await supabase
      .from("runclub_profiles")
      .select("*")
      .eq("id", profileId)
      .maybeSingle();
      
    if (runClubError) {
      console.error("Error fetching run club profile after user verification:", runClubError);
      throw new Error("Failed to fetch run club data: " + runClubError.message);
    }
    
    if (!runClubData) {
      console.error("Run club profile not found for verified user:", profileId);
      throw new Error("Run club profile not found for this user");
    }
    
    console.log("Found run club profile via user verification:", runClubData);
    return { data: runClubData as RunclubProfile, error: null };
    
  } catch (error: any) {
    console.error("Error in fetchRunClubProfile:", error);
    return { data: null, error: error.message };
  }
}
