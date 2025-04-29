
import { useState, useEffect, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useTagManagement } from "@/hooks/useTagManagement";
import { fetchBrandProfileData, updateBrandProfileData } from "@/api/brandProfileApi";
import { 
  brandProfileFormSchema, 
  type BrandProfileFormValues, 
  defaultBrandProfileValues 
} from "@/schemas/brandProfileFormSchema";

export function useBrandProfileForm(initialValues = defaultBrandProfileValues) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [selectedTargetAudience, setSelectedTargetAudience] = useState<string>("");
  const [selectedPreviousSponsorship, setSelectedPreviousSponsorship] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Initialize the form with default values that have empty arrays
  const form = useForm<BrandProfileFormValues>({
    resolver: zodResolver(brandProfileFormSchema),
    defaultValues: {
      ...initialValues,
      targetAudience: initialValues.targetAudience || [],
      previousSponsorship: initialValues.previousSponsorship || []
    }
  });

  const tagManagement = useTagManagement(form);

  // Fetch profile data when user is available
  useEffect(() => {
    if (!user) {
      console.log("No authenticated user available");
      return;
    }
    
    console.log("Authenticated user found, ID:", user.id);
    loadProfileData(user.id);
    setProfileId(user.id);
  }, [user]);

  // Load profile data from the API
  const loadProfileData = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const data = await fetchBrandProfileData(userId);
      if (data) {
        console.log("Brand profile data loaded:", data);
        updateFormWithProfileData(data);
      } else {
        console.log("No brand profile data found");
        // Initialize with empty arrays if no data found
        form.setValue("targetAudience", []);
        form.setValue("previousSponsorship", []);
      }
    } catch (error) {
      console.error("Error loading brand profile data:", error);
      toast({
        title: "Error loading profile",
        description: "Could not load your profile data",
        variant: "destructive"
      });
      // Initialize with empty arrays if error occurs
      form.setValue("targetAudience", []);
      form.setValue("previousSponsorship", []);
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
      console.log("Updating form with brand profile data:", profileData);
      
      // Map database fields to form fields
      const formData: Partial<BrandProfileFormValues> = {
        companyName: profileData.company_name || '',
        location: profileData.location || '',
        industry: profileData.industry || '',
        description: profileData.description || '',
        website: profileData.website || '',
        // Initialize arrays to empty if undefined
        targetAudience: [],
        previousSponsorship: []
      };
      
      // Extract social media data if available
      if (profileData.social_media) {
        const social = profileData.social_media;
        formData.linkedinHandle = social.linkedin || '';
        formData.twitterHandle = social.twitter || '';
        formData.instagramHandle = social.instagram || '';
        formData.facebookPage = social.facebook || '';
      }
      
      // Extract company data if available
      if (profileData.company_data) {
        const company = profileData.company_data;
        formData.foundedYear = company.founded_year || null;
        formData.companySize = company.company_size || '';
        // Ensure we have arrays even if the data is null/undefined
        formData.targetAudience = Array.isArray(company.target_audience) ? company.target_audience : [];
        formData.previousSponsorship = Array.isArray(company.previous_sponsorship) ? company.previous_sponsorship : [];
      }
      
      // Update the form with the extracted data
      form.reset(formData);
    }
  }, [form, isEditing]);

  // Handle form submission
  const onSubmit = async (data: BrandProfileFormValues) => {
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

      console.log("Updating brand profile for user:", user.id);
      
      const result = await updateBrandProfileData(user.id, data);

      if (!result.success) {
        // Get the detailed error message
        let errorMessage = "Unknown error occurred";
        
        if (result.error) {
          // If error is an Error object
          if (result.error instanceof Error) {
            errorMessage = result.error.message;
          } 
          // If error is from Supabase
          else if (typeof result.error === 'object' && result.error !== null) {
            errorMessage = result.error.message || JSON.stringify(result.error);
          }
        }
        
        console.error("Profile update error details:", result.error);
          
        toast({
          title: "Error updating profile",
          description: errorMessage,
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
      
      // Reload the profile data to ensure we have the latest
      await loadProfileData(user.id);
      
    } catch (error) {
      console.error('Error updating brand profile:', error);
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
    selectedTargetAudience,
    selectedPreviousSponsorship,
    profileId,
    user,
    setSelectedTargetAudience,
    setSelectedPreviousSponsorship,
    toggleEditSection,
    onSubmit,
    addTargetAudience: (tag: string) => 
      tagManagement.addArrayItem('targetAudience', tag),
    removeTargetAudience: (index: number) => 
      tagManagement.removeArrayItem('targetAudience', index),
    addPreviousSponsorship: (tag: string) => 
      tagManagement.addArrayItem('previousSponsorship', tag),
    removePreviousSponsorship: (index: number) => 
      tagManagement.removeArrayItem('previousSponsorship', index)
  };
}
