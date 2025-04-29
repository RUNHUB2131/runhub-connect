
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
    const { error } = await supabase
      .from('runclub_profiles')
      .upsert({
        id: userId, // This is essential for Row Level Security
        club_name: data.clubName,
        location: data.location,
        member_count: data.memberCount,
        description: data.description,
        website: data.website,
        // Add other fields as needed
        updated_at: new Date().toISOString()
      });

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
