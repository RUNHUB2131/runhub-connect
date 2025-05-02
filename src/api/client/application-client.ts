
import { supabase } from "@/integrations/supabase/client";
import { ApiResult, createSuccessResult, createErrorResult, handleApiError } from "@/utils/error-handling";
import type { Application } from "../types/opportunity.types";

/**
 * Applies for an opportunity
 */
export async function applyForOpportunity(opportunityId: string): Promise<ApiResult<Application>> {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return createErrorResult("Authentication error: " + (userError?.message || "User not found"));
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
      return createErrorResult("Failed to apply for opportunity: " + error.message);
    }

    return createSuccessResult(data as Application);
  } catch (error) {
    return handleApiError<Application>(error);
  }
}

/**
 * Fetches applications made by the current user
 */
export async function fetchUserApplications(): Promise<ApiResult<any[]>> {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return createErrorResult("Authentication error: " + (userError?.message || "User not found"));
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
      return createErrorResult("Failed to fetch applications: " + error.message);
    }

    return createSuccessResult(applications);
  } catch (error) {
    return handleApiError<any[]>(error);
  }
}

/**
 * Deletes an application
 */
export async function deleteApplication(applicationId: string): Promise<ApiResult<void>> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return createErrorResult("Authentication error: " + (userError?.message || "User not found"));
    }

    // Delete the application (with user_id check for security)
    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", applicationId)
      .eq("user_id", user.id);

    if (error) {
      return createErrorResult("Failed to delete application: " + error.message);
    }

    return createSuccessResult(undefined);
  } catch (error) {
    return handleApiError<void>(error);
  }
}
