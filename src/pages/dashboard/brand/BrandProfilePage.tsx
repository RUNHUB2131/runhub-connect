
import React from 'react';
import { Form } from "@/components/ui/form";
import { useBrandProfileForm } from "@/hooks/useBrandProfileForm";
import BrandBasicInfoSection from "@/components/profile/BrandBasicInfoSection";
import BrandSocialMediaSection from "@/components/profile/BrandSocialMediaSection";
import BrandDetailsSection from "@/components/profile/BrandDetailsSection";

const BrandProfilePage: React.FC = () => {
  const {
    form,
    isEditing,
    isLoading,
    selectedTargetAudience,
    selectedPreviousSponsorship,
    setSelectedTargetAudience,
    setSelectedPreviousSponsorship,
    toggleEditSection,
    onSubmit,
    addTargetAudience,
    removeTargetAudience,
    addPreviousSponsorship,
    removePreviousSponsorship
  } = useBrandProfileForm();

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Brand Profile</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Basic Info Section */}
            <BrandBasicInfoSection 
              form={form}
              isEditing={isEditing}
              isLoading={isLoading}
              toggleEditSection={toggleEditSection}
            />

            {/* Social Media Section */}
            <BrandSocialMediaSection 
              form={form}
              isEditing={isEditing}
              isLoading={isLoading}
              toggleEditSection={toggleEditSection}
            />
            
            {/* Brand Details Section */}
            <BrandDetailsSection 
              form={form}
              isEditing={isEditing}
              isLoading={isLoading}
              selectedTargetAudience={selectedTargetAudience}
              selectedPreviousSponsorship={selectedPreviousSponsorship}
              toggleEditSection={toggleEditSection}
              setSelectedTargetAudience={setSelectedTargetAudience}
              setSelectedPreviousSponsorship={setSelectedPreviousSponsorship}
              addTargetAudience={addTargetAudience}
              removeTargetAudience={removeTargetAudience}
              addPreviousSponsorship={addPreviousSponsorship}
              removePreviousSponsorship={removePreviousSponsorship}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BrandProfilePage;
