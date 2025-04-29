
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

// Define the form schema with validation rules
export const profileFormSchema = z.object({
  clubName: z.string().min(2, "Club name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  memberCount: z.coerce.number().int().nonnegative("Member count must be a positive number"),
  description: z.string().max(500, "Description cannot exceed 500 characters"),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  instagramHandle: z.string().optional(),
  instagramFollowers: z.coerce.number().int().nonnegative("Follower count must be a positive number"),
  twitterHandle: z.string().optional(),
  twitterFollowers: z.coerce.number().int().nonnegative("Follower count must be a positive number"),
  facebookPage: z.string().optional(),
  facebookFollowers: z.coerce.number().int().nonnegative("Follower count must be a positive number"),
  averageGroupSize: z.coerce.number().int().nonnegative("Group size must be a positive number"),
  coreDemographic: z.string(),
  runTypes: z.array(z.string()),
  eventExperience: z.array(z.string())
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const defaultProfileValues: ProfileFormValues = {
  clubName: "Sunrise Runners",
  location: "San Francisco, CA",
  memberCount: 45,
  description: "A diverse run club meeting twice weekly for morning and evening runs, welcoming runners of all levels. We organize monthly events and participate in local races.",
  website: "https://sunriserunners.com",
  instagramHandle: "sunrise_runners",
  instagramFollowers: 1200,
  twitterHandle: "sunriserunSF",
  twitterFollowers: 750,
  facebookPage: "Sunrise Runners Club",
  facebookFollowers: 980,
  averageGroupSize: 25,
  coreDemographic: "25-34",
  runTypes: ["Road", "Trail", "Track", "Urban"],
  eventExperience: ["Races", "Charity Runs", "Sponsored Events", "Community Meetups"]
};

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

  // Fetch profile data when user is available
  useEffect(() => {
    if (user) {
      fetchProfileData(user.id);
      setProfileId(user.id);
    }
  }, [user]);

  // Toggle section editing
  const toggleEditSection = (section: string | null) => {
    setIsEditing(section);
  };

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
      const { error } = await supabase
        .from('runclub_profiles')
        .upsert({
          id: user.id,
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
        toast({
          title: "Error updating profile",
          description: error.message,
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

  // Fetch profile data from Supabase
  const fetchProfileData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('runclub_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile data:', error);
        return;
      }

      if (data) {
        updateFormWithProfileData(data);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  // Update form with profile data
  const updateFormWithProfileData = (profileData: any) => {
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
  };

  // Tag management methods with immediate updates
  const addRunType = () => {
    if (!selectedRunType) return;
    
    const currentRunTypes = form.getValues("runTypes");
    if (!currentRunTypes.includes(selectedRunType)) {
      form.setValue("runTypes", [...currentRunTypes, selectedRunType], { shouldDirty: true });
      setSelectedRunType("");
    }
  };

  const removeRunType = (type: string) => {
    const currentRunTypes = form.getValues("runTypes");
    // Immediately update the form value
    form.setValue(
      "runTypes", 
      currentRunTypes.filter(t => t !== type),
      { shouldDirty: true }
    );
  };

  const addEventExperience = () => {
    if (!selectedEventExp) return;
    
    const currentEvents = form.getValues("eventExperience");
    if (!currentEvents.includes(selectedEventExp)) {
      form.setValue("eventExperience", [...currentEvents, selectedEventExp], { shouldDirty: true });
      setSelectedEventExp("");
    }
  };

  const removeEventExperience = (event: string) => {
    const currentEvents = form.getValues("eventExperience");
    // Immediately update the form value
    form.setValue(
      "eventExperience", 
      currentEvents.filter(e => e !== event),
      { shouldDirty: true }
    );
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
    addRunType,
    removeRunType,
    addEventExperience,
    removeEventExperience
  };
}
