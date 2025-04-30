
import { supabase } from "@/integrations/supabase/client";
import { Application, RunclubProfile } from "./types/opportunity.types";

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
