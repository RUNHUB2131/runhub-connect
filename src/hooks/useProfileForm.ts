
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [profileId, setProfileId] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialValues
  });

  // Toggle section editing
  const toggleEditSection = (section: string | null) => {
    setIsEditing(section);
  };

  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    if (!profileId) {
      toast({
        title: "Error",
        description: "User not authenticated. Please log in to update your profile.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Update the profile in Supabase
      const { error } = await supabase
        .from('runclub_profiles')
        .upsert({
          id: profileId,
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
        return;
      }

      toast({
        title: "Profile updated",
        description: "Your profile changes have been saved.",
      });
      
      setIsEditing(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating your profile.",
        variant: "destructive"
      });
    }
  };

  // Tag management methods
  const addRunType = () => {
    if (!selectedRunType) return;
    
    const currentRunTypes = form.getValues("runTypes");
    if (!currentRunTypes.includes(selectedRunType)) {
      form.setValue("runTypes", [...currentRunTypes, selectedRunType]);
      setSelectedRunType("");
    }
  };

  const removeRunType = (type: string) => {
    const currentRunTypes = form.getValues("runTypes");
    form.setValue("runTypes", currentRunTypes.filter(t => t !== type));
  };

  const addEventExperience = () => {
    if (!selectedEventExp) return;
    
    const currentEvents = form.getValues("eventExperience");
    if (!currentEvents.includes(selectedEventExp)) {
      form.setValue("eventExperience", [...currentEvents, selectedEventExp]);
      setSelectedEventExp("");
    }
  };

  const removeEventExperience = (event: string) => {
    const currentEvents = form.getValues("eventExperience");
    form.setValue("eventExperience", currentEvents.filter(e => e !== event));
  };

  return {
    form,
    isEditing,
    selectedRunType,
    selectedEventExp,
    profileId,
    setProfileId,
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
