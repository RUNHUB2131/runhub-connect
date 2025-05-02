
import { supabase } from "@/integrations/supabase/client";
import { OpportunityFormValues } from "@/schemas/opportunityFormSchema";
import { Opportunity } from "./types/opportunity.types";

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

export async function deleteOpportunity(id: string) {
  try {
    console.log("Starting deleteOpportunity for ID:", id);
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Authentication error:", userError?.message || "User not found");
      throw new Error("Authentication error: " + (userError?.message || "User not found"));
    }

    console.log("Authenticated user:", user.id);

    // Verify the opportunity belongs to the brand before deletion
    const { data: opportunity, error: fetchError } = await supabase
      .from("opportunities")
      .select("brand_id")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Failed to fetch opportunity:", fetchError.message);
      throw new Error("Failed to fetch opportunity: " + fetchError.message);
    }

    if (opportunity.brand_id !== user.id) {
      console.error("Unauthorized: User does not own this opportunity");
      throw new Error("Unauthorized: You can only delete your own opportunities");
    }

    console.log("Authorization verified. Proceeding with deletion of applications...");

    // First delete all applications associated with this opportunity
    const { error: deleteAppsError } = await supabase
      .from("applications")
      .delete()
      .eq("opportunity_id", id);

    if (deleteAppsError) {
      console.error("Failed to delete associated applications:", deleteAppsError);
      throw new Error("Failed to delete associated applications: " + deleteAppsError.message);
    }

    console.log("Associated applications deleted. Proceeding with opportunity deletion...");

    // Now delete the opportunity
    const { error: deleteError } = await supabase
      .from("opportunities")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Failed to delete opportunity:", deleteError);
      throw new Error("Failed to delete opportunity: " + deleteError.message);
    }

    console.log("Opportunity successfully deleted");
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error in deleteOpportunity:", error);
    return { success: false, error: error.message };
  }
}
