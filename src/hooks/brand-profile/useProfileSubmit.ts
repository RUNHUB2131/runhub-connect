
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { updateBrandProfileData } from "@/api/brandProfileApi";
import { BrandProfileFormValues } from "@/schemas/brandProfileFormSchema";
import { UseFormReturn } from 'react-hook-form';

interface UseProfileSubmitProps {
  form: UseFormReturn<BrandProfileFormValues>;
  toggleEditSection: (section: string | null) => void;
  loadProfileData: (userId: string) => Promise<void>;
  userId?: string;
}

export function useProfileSubmit({ form, toggleEditSection, loadProfileData, userId }: UseProfileSubmitProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Handle form submission
  const onSubmit = async (data: BrandProfileFormValues) => {
    setIsLoading(true);
    
    try {
      if (!userId) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to update your profile. Please log in and try again.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      console.log("Updating brand profile for user:", userId);
      console.log("Update data:", data);
      
      const result = await updateBrandProfileData(userId, data);

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
      
      toggleEditSection(null);
      
      // Reload the profile data to ensure we have the latest
      if (userId) {
        await loadProfileData(userId);
      }
      
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
    isLoading,
    onSubmit
  };
}
