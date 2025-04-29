
import { useBrandProfileData } from "./brand-profile/useBrandProfileData";
import { useEditSection } from "./brand-profile/useEditSection";
import { useProfileSubmit } from "./brand-profile/useProfileSubmit";
import { useProfileTags } from "./brand-profile/useProfileTags";
import { BrandProfileFormValues, defaultBrandProfileValues } from "@/schemas/brandProfileFormSchema";

export function useBrandProfileForm(initialValues = defaultBrandProfileValues) {
  // Compose hooks
  const { form, isLoading: isDataLoading, profileId, user, loadProfileData } = useBrandProfileData();
  const { isEditing, toggleEditSection } = useEditSection();
  const { selectedTargetAudience, selectedPreviousSponsorship, setSelectedTargetAudience, setSelectedPreviousSponsorship, addTargetAudience, removeTargetAudience, addPreviousSponsorship, removePreviousSponsorship } = useProfileTags(form);
  const { isLoading: isSubmitting, onSubmit } = useProfileSubmit({
    form, 
    toggleEditSection, 
    loadProfileData, 
    userId: user?.id
  });

  // Determine overall loading state
  const isLoading = isDataLoading || isSubmitting;

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
    addTargetAudience,
    removeTargetAudience,
    addPreviousSponsorship,
    removePreviousSponsorship
  };
}
