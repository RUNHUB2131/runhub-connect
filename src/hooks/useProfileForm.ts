
import { useState, useEffect, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useTagManagement } from "@/hooks/useTagManagement";
import { fetchProfileData, updateProfileData } from "@/api/profileApi";
import { 
  profileFormSchema, 
  type ProfileFormValues, 
  defaultProfileValues 
} from "@/schemas/profileFormSchema";

// Re-export ProfileFormValues for components that import from this file
export type { ProfileFormValues };

export function useProfileForm(initialValues = defaultProfileValues) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [selectedRunType, setSelectedRunType] = useState<string>("");
  const [selectedEventExp, setSelectedEventExp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Initialize the form with default values that have empty arrays for runTypes and eventExperience
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ...initialValues,
      runTypes: initialValues.runTypes || [],
      eventExperience: initialValues.eventExperience || []
    }
  });

  const tagManagement = useTagManagement(form);

  // Fetch profile data when user is available
  useEffect(() => {
    if (user) {
      loadProfileData(user.id);
      setProfileId(user.id);
    }
  }, [user]);

  // Load profile data from the API
  const loadProfileData = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const data = await fetchProfileData(userId);
      if (data) {
        console.log("Profile data loaded:", data);
        updateFormWithProfileData(data);
      } else {
        console.log("No profile data found");
        // Initialize with empty arrays if no data found
        form.setValue("runTypes", []);
        form.setValue("eventExperience", []);
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
      toast({
        title: "Error loading profile",
        description: "Could not load your profile data",
        variant: "destructive"
      });
      // Initialize with empty arrays if error occurs
      form.setValue("runTypes", []);
      form.setValue("eventExperience", []);
    } finally {
      setIsLoading(false);
    }
  }, [toast, form]);

  // Toggle section editing
  const toggleEditSection = useCallback((section: string | null) => {
    setIsEditing(section);
  }, []);

  // Update form with profile data
  const updateFormWithProfileData = useCallback((profileData: any) => {
    // Only update if we're not currently editing
    if (!isEditing) {
      console.log("Updating form with profile data:", profileData);
      
      // Map database fields to form fields
      const formData: Partial<ProfileFormValues> = {
        clubName: profileData.club_name || '',
        location: profileData.location || '',
        memberCount: profileData.member_count || 0,
        description: profileData.description || '',
        website: profileData.website || '',
        // Initialize arrays to empty if undefined
        runTypes: [],
        eventExperience: []
      };
      
      // Extract social media data if available
      if (profileData.social_media) {
        const social = profileData.social_media;
        
        if (social.instagram) {
          formData.instagramHandle = social.instagram.handle || '';
          formData.instagramFollowers = social.instagram.followers || 0;
        }
        
        if (social.twitter) {
          formData.twitterHandle = social.twitter.handle || '';
          formData.twitterFollowers = social.twitter.followers || 0;
        }
        
        if (social.facebook) {
          formData.facebookPage = social.facebook.page || '';
          formData.facebookFollowers = social.facebook.followers || 0;
        }
      }
      
      // Extract community data if available
      if (profileData.community_data) {
        const community = profileData.community_data;
        
        formData.averageGroupSize = community.average_group_size || 0;
        formData.coreDemographic = community.core_demographic || '';
        // Ensure we have arrays even if the data is null/undefined
        formData.runTypes = Array.isArray(community.run_types) ? community.run_types : [];
        formData.eventExperience = Array.isArray(community.event_experience) ? community.event_experience : [];
      }
      
      // Update the form with the extracted data
      form.reset(formData);
    }
  }, [form, isEditing]);

  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    
    try {
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to update your profile. Please log in and try again.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      console.log("Updating profile for user:", user.id);
      
      // Update the profile in Supabase
      const result = await updateProfileData(user.id, data);

      if (!result.success) {
        toast({
          title: "Error updating profile",
          description: result.error.message,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Profile updated",
        description: "Your profile changes have been saved.",
      });
      
      setIsEditing(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isEditing,
    isLoading,
    selectedRunType,
    selectedEventExp,
    profileId,
    user,
    setSelectedRunType,
    setSelectedEventExp,
    toggleEditSection,
    onSubmit,
    ...tagManagement
  };
}
