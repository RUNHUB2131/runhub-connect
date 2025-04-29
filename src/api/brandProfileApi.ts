
import { supabase } from "@/integrations/supabase/client";
import { BrandProfileFormValues } from "@/schemas/brandProfileFormSchema";

export async function fetchBrandProfileData(userId: string) {
  try {
    const { data, error } = await supabase
      .from('brand_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle(); // Using maybeSingle instead of single to avoid errors if no data exists

    if (error) {
      console.error('Error fetching brand profile data:', error);
      return null;
    }

    console.log("Fetched brand profile data:", data);
    return data;
  } catch (error) {
    console.error('Error fetching brand profile data:', error);
    return null;
  }
}

export async function updateBrandProfileData(userId: string, data: BrandProfileFormValues) {
  try {
    const session = await supabase.auth.getSession();
    const authUser = session.data.session?.user;
    
    if (!authUser) {
      console.error('Authentication error: No user session found');
      return { success: false, error: new Error('Authentication error: Please log in again') };
    }
    
    if (authUser.id !== userId) {
      console.error('Security error: User ID mismatch');
      return { success: false, error: new Error('Security error: Invalid user ID') };
    }
    
    // Ensure arrays are initialized
    const targetAudience = Array.isArray(data.targetAudience) ? data.targetAudience : [];
    const previousSponsorship = Array.isArray(data.previousSponsorship) ? data.previousSponsorship : [];
    
    // Create a structured object that maps form fields to database columns
    const profileData = {
      // Do not set id field for updates - this causes RLS issues
      company_name: data.companyName,
      location: data.location,
      industry: data.industry,
      description: data.description,
      website: data.website,
      social_media: {
        linkedin: data.linkedinHandle,
        twitter: data.twitterHandle,
        instagram: data.instagramHandle,
        facebook: data.facebookPage
      },
      company_data: {
        founded_year: data.foundedYear,
        company_size: data.companySize,
        target_audience: targetAudience,
        previous_sponsorship: previousSponsorship
      },
      updated_at: new Date().toISOString()
    };

    console.log("Processing profile update for user:", userId);

    // First, check if the profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('brand_profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking if profile exists:', checkError);
      return { success: false, error: checkError };
    }

    let result;
    
    if (existingProfile) {
      // Update existing profile
      console.log("Updating existing brand profile...");
      result = await supabase
        .from('brand_profiles')
        .update(profileData)
        .eq('id', userId);
    } else {
      // Insert new profile
      console.log("Creating new brand profile...");
      // For new profiles, we must include the ID
      const newProfileData = {
        id: userId,
        ...profileData
      };
      
      result = await supabase
        .from('brand_profiles')
        .insert([newProfileData]);
    }

    const { error } = result;

    if (error) {
      console.error('Error updating brand profile:', error);
      return { success: false, error };
    }

    console.log("Brand profile updated successfully");
    return { success: true };
  } catch (error) {
    console.error('Error updating brand profile:', error);
    return { success: false, error };
  }
}
