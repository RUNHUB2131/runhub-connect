
import { supabase } from "@/integrations/supabase/client";
import { Application, RunclubProfile } from "./types/opportunity.types";

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
    
    // Now fetch the related run club profiles in a separate query
    const applicationsWithProfiles: Application[] = [...(applications || [])];
    
    if (applicationsWithProfiles.length > 0) {
      const userIds = applicationsWithProfiles.map(app => app.user_id);
      
      const { data: profiles, error: profilesError } = await supabase
        .from("runclub_profiles")
        .select("*")
        .in("id", userIds);
        
      if (profilesError) {
        console.error("Error fetching runclub profiles:", profilesError);
      } else if (profiles) {
        // Map profiles to applications
        const profilesMap: Record<string, RunclubProfile> = {};
        profiles.forEach(profile => {
          profilesMap[profile.id] = profile as RunclubProfile;
        });
        
        // Add profiles to applications
        applicationsWithProfiles.forEach(app => {
          app.runclub_profile = profilesMap[app.user_id] || null;
        });
      }
    }
    
    console.log(`Found ${applicationsWithProfiles.length || 0} applications with profiles:`, applicationsWithProfiles);
    
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
