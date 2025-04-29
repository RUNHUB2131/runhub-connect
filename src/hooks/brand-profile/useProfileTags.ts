
import { useState } from 'react';
import { useTagManagement } from "@/hooks/useTagManagement";
import { UseFormReturn } from "react-hook-form";
import { BrandProfileFormValues } from "@/schemas/brandProfileFormSchema";

export function useProfileTags(form: UseFormReturn<BrandProfileFormValues>) {
  const [selectedTargetAudience, setSelectedTargetAudience] = useState<string>("");
  const [selectedPreviousSponsorship, setSelectedPreviousSponsorship] = useState<string>("");
  
  const tagManagement = useTagManagement(form);

  return {
    selectedTargetAudience,
    selectedPreviousSponsorship,
    setSelectedTargetAudience,
    setSelectedPreviousSponsorship,
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
