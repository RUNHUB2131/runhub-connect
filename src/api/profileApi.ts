
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormValues } from "@/schemas/profileFormSchema";

export async function fetchProfileData(userId: string) {
  try {
    const { data, error } = await supabase
      .from('runclub_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile data:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return null;
  }
}

export async function updateProfileData(userId: string, data: ProfileFormValues) {
  try {
    // Ensure arrays are initialized
    const runTypes = Array.isArray(data.runTypes) ? data.runTypes : [];
    const eventExperience = Array.isArray(data.eventExperience) ? data.eventExperience : [];
    
    // Create a structured object that maps form fields to database columns
    const profileData = {
      id: userId, // This is essential for Row Level Security
      club_name: data.clubName,
      location: data.location,
      member_count: data.memberCount,
      description: data.description,
      website: data.website,
      // Social media fields stored as JSON
      social_media: {
        instagram: {
          handle: data.instagramHandle,
          followers: data.instagramFollowers
        },
        twitter: {
          handle: data.twitterHandle,
          followers: data.twitterFollowers
        },
        facebook: {
          page: data.facebookPage,
          followers: data.facebookFollowers
        }
      },
      // Community data
      community_data: {
        average_group_size: data.averageGroupSize,
        core_demographic: data.coreDemographic,
        run_types: runTypes,
        event_experience: eventExperience
      },
      updated_at: new Date().toISOString()
    };

    console.log("Saving profile data:", profileData);

    const { error } = await supabase
      .from('runclub_profiles')
      .upsert(profileData);

    if (error) {
      console.error('Error updating profile:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error };
  }
}
