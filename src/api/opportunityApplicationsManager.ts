
import { supabase } from "@/integrations/supabase/client";
import type { Application, RunclubProfile } from "./types/opportunity.types";
import { Json } from "@/integrations/supabase/types";

// Type guard function to validate RunclubProfile shape
function isRunclubProfile(obj: unknown): obj is RunclubProfile {
  if (!obj || typeof obj !== 'object') return false;
  
  // Basic structure validation - add more properties as needed
  const profile = obj as Record<string, unknown>;
  return (
    ('id' in profile && typeof profile.id === 'string') ||
    ('user_id' in profile && typeof profile.user_id === 'string')
  );
}

// Helper to safely convert Json to Record<string, any>
function safeJsonToRecord(json: Json | null): Record<string, any> | null {
  if (json === null) return null;
  if (typeof json === 'object' && json !== null) return json as Record<string, any>;
  return null;
}

export async function fetchOpportunityApplications(opportunityId: string) {
  console.log("START: fetchOpportunityApplications for ID:", opportunityId);
  
  if (!opportunityId) {
    console.error("No opportunity ID provided");
    return { data: null, error: "No opportunity ID provided" };
  }
  
  try {
    // Get the current user (brand)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Authentication error:", userError?.message || "User not found");
      throw new Error("Authentication error: " + (userError?.message || "User not found"));
    }
    
    console.log("Authenticated user:", user.id);
    
    // First verify this opportunity belongs to the current brand
    const { data: opportunity, error: opportunityError } = await supabase
      .from("opportunities")
      .select("id, brand_id")
      .eq("id", opportunityId)
      .single();
      
    if (opportunityError) {
      console.error("Error fetching opportunity:", opportunityError);
      throw new Error("Failed to fetch opportunity: " + opportunityError.message);
    }
    
    if (!opportunity || opportunity.brand_id !== user.id) {
      console.error("Not authorized to view applications for this opportunity");
      throw new Error("Not authorized to view applications for this opportunity");
    }
    
    console.log("Opportunity verified, belongs to current brand");
    
    // Fetch applications for this opportunity
    const { data: applications, error: applicationsError } = await supabase
      .from("applications")
      .select(`
        id,
        opportunity_id,
        user_id,
        status,
        created_at,
        updated_at
      `)
      .eq("opportunity_id", opportunityId);
      
    if (applicationsError) {
      console.error("Error fetching applications:", applicationsError);
      throw new Error("Failed to fetch applications: " + applicationsError.message);
    }
    
    // Create an explicitly typed array for our applications
    const applicationsWithProfiles: Application[] = [];
    
    // Process applications only if we have any
    if (applications && applications.length > 0) {
      // Extract all user IDs to fetch their profiles
      const userIds = applications.map(app => app.user_id);
      console.log("User IDs to fetch profiles for:", userIds);
      
      // Create a map for profiles with explicit typing
      const profileMap: Record<string, RunclubProfile> = {};
      
      // Fetch runclub profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("runclub_profiles")
        .select("*")
        .in("id", userIds);
        
      if (!profilesError && profiles && profiles.length > 0) {
        console.log("Fetched profiles:", profiles.length);
        
        // Map each profile to its ID with proper type handling
        for (const rawProfile of profiles) {
          if (rawProfile && rawProfile.id) {
            // Create a properly shaped RunclubProfile
            const typedProfile: RunclubProfile = {
              id: rawProfile.id,
              club_name: rawProfile.club_name,
              location: rawProfile.location,
              member_count: rawProfile.member_count,
              description: rawProfile.description,
              website: rawProfile.website,
              logo_url: rawProfile.logo_url,
              community_data: safeJsonToRecord(rawProfile.community_data),
              social_media: safeJsonToRecord(rawProfile.social_media),
              created_at: rawProfile.created_at,
              updated_at: rawProfile.updated_at,
              user_id: rawProfile.id // Use ID as user_id if it's missing
            };
            profileMap[rawProfile.id] = typedProfile;
          }
        }
      } else {
        console.log("No profiles found with primary key match, trying alternate approach");
        
        // After analyzing the errors, it's clear that user_id doesn't exist in runclub_profiles table
        // Instead, we'll try a different approach - assuming the id in runclub_profiles is what we need
        
        // Since we've already tried with ID matching above and it didn't work,
        // we could try a different approach if needed here
        console.log("No profiles found via direct ID match. This could indicate that user IDs and profile IDs don't match.");
        
        // We won't add additional queries here since the schema doesn't support it,
        // but we'll leave this section for potential future schema updates
      }
      
      // Map applications to their profiles
      for (const app of applications) {
        // Create properly typed application with profile
        const application: Application = {
          id: app.id,
          opportunity_id: app.opportunity_id,
          user_id: app.user_id,
          status: app.status,
          created_at: app.created_at,
          updated_at: app.updated_at,
          runclub_profile: profileMap[app.user_id] || null
        };
        
        applicationsWithProfiles.push(application);
      }
    }
    
    console.log(`Found ${applicationsWithProfiles.length} applications with profiles`);
    
    return { data: applicationsWithProfiles, error: null };
    
  } catch (error: any) {
    console.error("Error in fetchOpportunityApplications:", error);
    return { data: null, error: error.message };
  }
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  try {
    // Get the current user (brand)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("Authentication error: " + (userError?.message || "User not found"));
    }

    // Update the application status
    const { data, error } = await supabase
      .from("applications")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", applicationId)
      .select()
      .single();

    if (error) {
      throw new Error("Failed to update application status: " + error.message);
    }

    return { data, error: null };
  } catch (error: any) {
    console.error("Error updating application status:", error);
    return { data: null, error: error.message };
  }
}
