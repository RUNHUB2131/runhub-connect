
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

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialValues
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
    const data = await fetchProfileData(userId);
    if (data) {
      updateFormWithProfileData(data);
    }
  }, []);

  // Toggle section editing
  const toggleEditSection = useCallback((section: string | null) => {
    setIsEditing(section);
  }, []);

  // Update form with profile data
  const updateFormWithProfileData = useCallback((profileData: any) => {
    // Only update if we're not currently editing
    if (!isEditing) {
      // Map database fields to form fields
      form.reset({
        clubName: profileData.club_name || form.getValues("clubName"),
        location: profileData.location || form.getValues("location"),
        memberCount: profileData.member_count || form.getValues("memberCount"),
        description: profileData.description || form.getValues("description"),
        website: profileData.website || form.getValues("website"),
        // Map other fields as needed
        // For fields not in the database yet, keep the current form values
        instagramHandle: form.getValues("instagramHandle"),
        instagramFollowers: form.getValues("instagramFollowers"),
        twitterHandle: form.getValues("twitterHandle"),
        twitterFollowers: form.getValues("twitterFollowers"),
        facebookPage: form.getValues("facebookPage"),
        facebookFollowers: form.getValues("facebookFollowers"),
        averageGroupSize: form.getValues("averageGroupSize"),
        coreDemographic: form.getValues("coreDemographic"),
        runTypes: form.getValues("runTypes"),
        eventExperience: form.getValues("eventExperience")
      });
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
