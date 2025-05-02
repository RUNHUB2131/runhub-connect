
import { supabase } from "@/integrations/supabase/client";
import { ApiResult, createSuccessResult, createErrorResult, handleApiError } from "@/utils/error-handling";
import type { Opportunity, Application, RunclubProfile } from "../types/opportunity.types";
import type { OpportunityFormValues } from "@/schemas/opportunityFormSchema";

/**
 * Creates a new opportunity
 */
export async function createOpportunity(data: OpportunityFormValues): Promise<ApiResult<Opportunity>> {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return createErrorResult("Authentication error: " + (userError?.message || "User not found"));
    }

    // Insert the new opportunity
    const { data: opportunity, error } = await supabase
      .from("opportunities")
      .insert({
        title: data.title,
        description: data.description,
        detailed_description: data.detailed_description || null,
        type: data.type,
        reward: data.reward,
        deadline: data.deadline,
        duration: data.duration,
        requirements: data.requirements || null,
        brand_id: user.id,
      })
      .select()
      .single();

    if (error) {
      return createErrorResult("Failed to create opportunity: " + error.message);
    }

    return createSuccessResult(opportunity as Opportunity);
  } catch (error) {
    return handleApiError<Opportunity>(error);
  }
}

/**
 * Fetches opportunities created by the current brand
 */
export async function fetchBrandOpportunities(): Promise<ApiResult<Opportunity[]>> {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return createErrorResult("Authentication error: " + (userError?.message || "User not found"));
    }

    // Fetch opportunities created by this brand
    const { data, error } = await supabase
      .from("opportunities")
      .select()
      .eq("brand_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return createErrorResult("Failed to fetch opportunities: " + error.message);
    }

    return createSuccessResult(data as Opportunity[]);
  } catch (error) {
    return handleApiError<Opportunity[]>(error);
  }
}

/**
 * Fetches all active opportunities
 */
export async function fetchAllOpportunities(): Promise<ApiResult<Opportunity[]>> {
  try {
    const { data, error } = await supabase
      .from("opportunities")
      .select()
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      return createErrorResult("Failed to fetch opportunities: " + error.message);
    }

    return createSuccessResult(data as Opportunity[]);
  } catch (error) {
    return handleApiError<Opportunity[]>(error);
  }
}

/**
 * Fetches a single opportunity by ID
 */
export async function fetchOpportunityById(id: string): Promise<ApiResult<Opportunity>> {
  try {
    const { data, error } = await supabase
      .from("opportunities")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      return createErrorResult("Failed to fetch opportunity: " + error.message);
    }

    return createSuccessResult(data as Opportunity);
  } catch (error) {
    return handleApiError<Opportunity>(error);
  }
}

/**
 * Deletes an opportunity
 */
export async function deleteOpportunity(id: string): Promise<ApiResult<void>> {
  try {
    console.log("Starting deleteOpportunity for ID:", id);
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Authentication error:", userError?.message || "User not found");
      return createErrorResult("Authentication error: " + (userError?.message || "User not found"));
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
      return createErrorResult("Failed to fetch opportunity: " + fetchError.message);
    }

    if (opportunity.brand_id !== user.id) {
      console.error("Unauthorized: User does not own this opportunity");
      return createErrorResult("Unauthorized: You can only delete your own opportunities");
    }

    console.log("Authorization verified. Proceeding with deletion of applications...");

    // First delete all applications associated with this opportunity
    const { error: deleteAppsError } = await supabase
      .from("applications")
      .delete()
      .eq("opportunity_id", id);

    if (deleteAppsError) {
      console.error("Failed to delete associated applications:", deleteAppsError);
      return createErrorResult("Failed to delete associated applications: " + deleteAppsError.message);
    }

    console.log("Associated applications deleted. Proceeding with opportunity deletion...");

    // Now delete the opportunity
    const { error: deleteError } = await supabase
      .from("opportunities")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Failed to delete opportunity:", deleteError);
      return createErrorResult("Failed to delete opportunity: " + deleteError.message);
    }

    console.log("Opportunity successfully deleted");
    return createSuccessResult(undefined);
  } catch (error) {
    return handleApiError<void>(error);
  }
}

/**
 * Fetches applications for a specific opportunity
 */
export async function fetchOpportunityApplications(opportunityId: string): Promise<ApiResult<Application[]>> {
  try {
    console.log("START: fetchOpportunityApplications for ID:", opportunityId);
    
    if (!opportunityId) {
      console.error("No opportunity ID provided");
      return createErrorResult("No opportunity ID provided");
    }
    
    // Get the current user (brand)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Authentication error:", userError?.message || "User not found");
      return createErrorResult("Authentication error: " + (userError?.message || "User not found"));
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
      return createErrorResult("Failed to fetch opportunity: " + opportunityError.message);
    }
    
    if (!opportunity || opportunity.brand_id !== user.id) {
      console.error("Not authorized to view applications for this opportunity");
      return createErrorResult("Not authorized to view applications for this opportunity");
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
      return createErrorResult("Failed to fetch applications: " + applicationsError.message);
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
      
      // Fetch runclub profiles with explicit column selection
      const { data: profiles, error: profilesError } = await supabase
        .from("runclub_profiles")
        .select("id, club_name, location, member_count, description, website, logo_url, community_data, social_media, created_at, updated_at")
        .in("id", userIds);
        
      if (!profilesError && profiles && profiles.length > 0) {
        console.log("Fetched profiles:", profiles.length);
        
        // Map each profile to its ID with proper type handling
        for (const rawProfile of profiles) {
          if (rawProfile && rawProfile.id) {
            // Create a properly shaped RunclubProfile
            profileMap[rawProfile.id] = {
              id: rawProfile.id,
              club_name: rawProfile.club_name || null,
              location: rawProfile.location || null,
              member_count: typeof rawProfile.member_count === 'number' ? rawProfile.member_count : 0,
              description: rawProfile.description || null,
              website: rawProfile.website || null,
              logo_url: rawProfile.logo_url || null,
              community_data: rawProfile.community_data || null,
              social_media: rawProfile.social_media || null,
              created_at: rawProfile.created_at || new Date().toISOString(),
              updated_at: rawProfile.updated_at || new Date().toISOString(),
              user_id: rawProfile.id // Use ID as user_id if it's missing
            };
          }
        }
      } else {
        console.log("No profiles found with primary key match, trying alternate approach");
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
    
    return createSuccessResult(applicationsWithProfiles);
  } catch (error) {
    return handleApiError<Application[]>(error);
  }
}

/**
 * Updates the status of an application
 */
export async function updateApplicationStatus(applicationId: string, status: string): Promise<ApiResult<Application>> {
  try {
    // Get the current user (brand)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return createErrorResult("Authentication error: " + (userError?.message || "User not found"));
    }

    // Update the application status
    const { data, error } = await supabase
      .from("applications")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", applicationId)
      .select()
      .single();

    if (error) {
      return createErrorResult("Failed to update application status: " + error.message);
    }

    return createSuccessResult(data as Application);
  } catch (error) {
    return handleApiError<Application>(error);
  }
}
