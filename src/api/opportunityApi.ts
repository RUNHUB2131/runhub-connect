
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
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("Authentication error: " + (userError?.message || "User not found"));
    }

    // First get the applications for this opportunity
    const { data: applications, error: applicationsError } = await supabase
      .from("applications")
      .select(`
        *
      `)
      .eq("opportunity_id", opportunityId);
    
    if (applicationsError) {
      throw new Error("Failed to fetch applications: " + applicationsError.message);
    }
    
    // For each application, fetch the runclub profile
    const processedApplications = await Promise.all(applications.map(async (app) => {
      const { data: profile, error: profileError } = await supabase
        .from("runclub_profiles")
        .select("*")
        .eq("id", app.user_id)
        .single();
        
      if (profileError) {
        console.warn("Error fetching profile for user", app.user_id, profileError);
        return { ...app, profile: null };
      }
      
      return { ...app, profile };
    }));

    console.log("Processed applications with profiles:", processedApplications);
    
    return { data: processedApplications, error: null };
  } catch (error: any) {
    console.error("Error fetching applications:", error);
    return { data: null, error: error.message };
  }
}

export async function fetchRunClubProfile(profileId: string) {
  try {
    const { data, error } = await supabase
      .from("runclub_profiles")
      .select("*")
      .eq("id", profileId)
      .single();

    if (error) {
      console.error("Error details:", error);
      throw new Error("Failed to fetch run club profile: " + error.message);
    }

    return { data, error: null };
  } catch (error: any) {
    console.error("Error fetching run club profile:", error);
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
