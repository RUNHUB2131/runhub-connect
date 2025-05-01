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
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("Authentication error: " + (userError?.message || "User not found"));
    }

    // Verify the opportunity belongs to the brand before deletion
    const { data: opportunity, error: fetchError } = await supabase
      .from("opportunities")
      .select("brand_id")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw new Error("Failed to fetch opportunity: " + fetchError.message);
    }

    if (opportunity.brand_id !== user.id) {
      throw new Error("Unauthorized: You can only delete your own opportunities");
    }

    // Delete the opportunity
    const { error: deleteError } = await supabase
      .from("opportunities")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw new Error("Failed to delete opportunity: " + deleteError.message);
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error deleting opportunity:", error);
    return { success: false, error: error.message };
  }
}
