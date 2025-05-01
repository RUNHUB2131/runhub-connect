import { supabase } from "@/integrations/supabase/client";
import type { Application, RunclubProfile } from "./types/opportunity.types";

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
      
      // Fetch runclub profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("runclub_profiles")
        .select("*")
        .in("id", userIds);
        
      // Create a map to store profiles by ID for quick lookup
      const profileMap: Record<string, RunclubProfile> = {};
      
      if (!profilesError && profiles && profiles.length > 0) {
        console.log("Fetched profiles:", profiles.length);
        
        // Map each profile to its ID
        profiles.forEach(profile => {
          if (profile && profile.id) {
            profileMap[profile.id] = profile as RunclubProfile;
          }
        });
      } else {
        console.log("No profiles found with primary key match, trying user_id field");
        
        // Try alternate lookup by user_id field
        const { data: altProfiles, error: altProfilesError } = await supabase
          .from("runclub_profiles")
          .select("*")
          .in("user_id", userIds);
          
        if (!altProfilesError && altProfiles && altProfiles.length > 0) {
          console.log("Found profiles via user_id field:", altProfiles.length);
          
          // Map each profile by user_id for lookup
          altProfiles.forEach(profile => {
            if (profile) {
              const typedProfile = profile as unknown as RunclubProfile;
              const mapKey = typedProfile.user_id || typedProfile.id;
              if (mapKey) {
                profileMap[mapKey] = typedProfile;
              }
            }
          });
        }
      }
      
      // Map applications to their profiles
      for (const app of applications) {
        applicationsWithProfiles.push({
          id: app.id,
          opportunity_id: app.opportunity_id,
          user_id: app.user_id,
          status: app.status,
          created_at: app.created_at,
          updated_at: app.updated_at,
          runclub_profile: profileMap[app.user_id] || null
        });
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
