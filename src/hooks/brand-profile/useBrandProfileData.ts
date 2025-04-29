
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fetchBrandProfileData } from "@/api/brandProfileApi";
import { BrandProfileFormValues, defaultBrandProfileValues } from "@/schemas/brandProfileFormSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { brandProfileFormSchema } from "@/schemas/brandProfileFormSchema";

export function useBrandProfileData() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Initialize the form with default values
  const form = useForm<BrandProfileFormValues>({
    resolver: zodResolver(brandProfileFormSchema),
    defaultValues: {
      ...defaultBrandProfileValues,
      targetAudience: defaultBrandProfileValues.targetAudience || [],
      previousSponsorship: defaultBrandProfileValues.previousSponsorship || []
    }
  });

  // Load profile data from the API
  const loadProfileData = useCallback(async (userId: string) => {
    console.log("Loading profile data for user:", userId);
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

  // Update form with profile data
  const updateFormWithProfileData = useCallback((profileData: any, currentIsEditing: string | null = null) => {
    // Only update if we're not currently editing
    if (!currentIsEditing) {
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
  }, [form]);

  // Fetch profile data when user is available
  useEffect(() => {
    if (!user) {
      console.log("No authenticated user available");
      return;
    }
    
    console.log("Authenticated user found, ID:", user.id);
    loadProfileData(user.id);
    setProfileId(user.id);
  }, [user, loadProfileData]);

  return {
    form,
    isLoading,
    setIsLoading,
    profileId,
    user,
    loadProfileData
  };
}
