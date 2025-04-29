
import { supabase } from "@/integrations/supabase/client";
import { OpportunityFormValues } from "@/schemas/opportunityFormSchema";

export async function createOpportunity(opportunityData: OpportunityFormValues) {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("Authentication error: " + (userError?.message || "User not found"));
    }

    // Insert the new opportunity
    const { data, error } = await supabase
      .from("opportunities")
      .insert({
        title: opportunityData.title,
        description: opportunityData.description,
        detailed_description: opportunityData.detailed_description || null,
        type: opportunityData.type,
        reward: opportunityData.reward,
        deadline: opportunityData.deadline,
        duration: opportunityData.duration,
        requirements: opportunityData.requirements || null,
        brand_id: user.id,
      })
      .select()
      .single();

    if (error) {
      throw new Error("Failed to create opportunity: " + error.message);
    }

    return { data, error: null };
  } catch (error: any) {
    console.error("Error creating opportunity:", error);
    return { data: null, error: error.message };
  }
}

export async function fetchBrandOpportunities() {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("Authentication error: " + (userError?.message || "User not found"));
    }

    // Fetch opportunities created by this brand
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .eq("brand_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("Failed to fetch opportunities: " + error.message);
    }

    return { data, error: null };
  } catch (error: any) {
    console.error("Error fetching opportunities:", error);
    return { data: null, error: error.message };
  }
}

export async function fetchAllOpportunities() {
  try {
    // Fetch all active opportunities
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("Failed to fetch opportunities: " + error.message);
    }

    return { data, error: null };
  } catch (error: any) {
    console.error("Error fetching opportunities:", error);
    return { data: null, error: error.message };
  }
}

export async function fetchOpportunityById(id: string) {
  try {
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error("Failed to fetch opportunity: " + error.message);
    }

    return { data, error: null };
  } catch (error: any) {
    console.error("Error fetching opportunity:", error);
    return { data: null, error: error.message };
  }
}

export async function applyForOpportunity(opportunityId: string) {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("Authentication error: " + (userError?.message || "User not found"));
    }

    // Insert the application
    const { data, error } = await supabase
      .from("applications")
      .insert({
        opportunity_id: opportunityId,
        user_id: user.id,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      throw new Error("Failed to apply for opportunity: " + error.message);
    }

    return { data, error: null };
  } catch (error: any) {
    console.error("Error applying for opportunity:", error);
    return { data: null, error: error.message };
  }
}

export async function fetchUserApplications() {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("Authentication error: " + (userError?.message || "User not found"));
    }

    // Fetch applications made by this user
    const { data: applications, error } = await supabase
      .from("applications")
      .select(`
        *,
        opportunity:opportunities(*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("Failed to fetch applications: " + error.message);
    }

    return { data: applications, error: null };
  } catch (error: any) {
    console.error("Error fetching applications:", error);
    return { data: null, error: error.message };
  }
}

export async function deleteApplication(applicationId: string) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("Authentication error: " + (userError?.message || "User not found"));
    }

    // Delete the application (with user_id check for security)
    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", applicationId)
      .eq("user_id", user.id);

    if (error) {
      throw new Error("Failed to delete application: " + error.message);
    }

    return { error: null };
  } catch (error: any) {
    console.error("Error deleting application:", error);
    return { error: error.message };
  }
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
      .select("*")
      .eq("opportunity_id", opportunityId);
      
    if (applicationsError) {
      console.error("Error fetching applications:", applicationsError);
      throw new Error("Failed to fetch applications: " + applicationsError.message);
    }
    
    console.log(`Found ${applications?.length || 0} applications`);
    
    if (!applications || applications.length === 0) {
      console.log("No applications found for this opportunity");
      return { data: [], error: null };
    }
    
    // Get user IDs from applications
    const userIds = applications.map(app => app.user_id);
    console.log("Looking up profiles for user IDs:", userIds);
    
    // Fetch profiles for the users who applied
    const { data: profiles, error: profilesError } = await supabase
      .from("runclub_profiles")
      .select("*")
      .in("id", userIds);
    
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      // Continue without profiles rather than failing completely
    }
    
    console.log(`Found ${profiles?.length || 0} runclub profiles`);
    
    // Map profiles to applications
    const enrichedApplications = applications.map(app => {
      const profile = profiles?.find(profile => profile.id === app.user_id) || null;
      return {
        ...app,
        profile
      };
    });
    
    console.log("Enriched applications data:", enrichedApplications);
    return { data: enrichedApplications, error: null };
    
  } catch (error: any) {
    console.error("Error in fetchOpportunityApplications:", error);
    return { data: null, error: error.message };
  }
}

export async function fetchRunClubProfile(profileId: string) {
  console.log("START: fetchRunClubProfile for ID:", profileId);
  
  if (!profileId) {
    console.error("No profile ID provided");
    return { data: null, error: "No profile ID provided" };
  }
  
  try {
    // First, check if this is a user_id from the auth system
    // and try to get the profile from the runclub_profiles table
    const { data, error } = await supabase
      .from("runclub_profiles")
      .select("*")
      .eq("id", profileId)
      .maybeSingle(); // Use maybeSingle() instead of single() to avoid error when no row is found
    
    if (error) {
      console.error("Error fetching run club profile:", error);
      throw new Error("Failed to fetch run club profile: " + error.message);
    }
    
    if (data) {
      console.log("Found profile directly with id:", profileId);
      return { data, error: null };
    }
    
    // If no profile was found, it might be because profileId is an auth.uid 
    // and we need to check if there's a runclub_profile with this user ID
    console.log("No direct profile match, checking if this is an auth user ID");
    
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
    return { data: runClubData, error: null };
    
  } catch (error: any) {
    console.error("Error in fetchRunClubProfile:", error);
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
