
import React from 'react';
import { Form } from "@/components/ui/form";
import { useProfileForm } from "@/hooks/useProfileForm";
import BasicInfoSection from "@/components/profile/BasicInfoSection";
import SocialMediaSection from "@/components/profile/SocialMediaSection";
import CommunityInfoSection from "@/components/profile/CommunityInfoSection";

const ProfilePage: React.FC = () => {
  const {
    form,
    isEditing,
    isLoading,
    selectedRunType,
    selectedEventExp,
    setSelectedRunType,
    setSelectedEventExp,
    toggleEditSection,
    onSubmit,
    addRunType,
    removeRunType,
    addEventExperience,
    removeEventExperience
  } = useProfileForm();

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Basic Info Section */}
            <BasicInfoSection 
              form={form}
              isEditing={isEditing}
              isLoading={isLoading}
              toggleEditSection={toggleEditSection}
            />

            {/* Social Media Section */}
            <SocialMediaSection 
              form={form}
              isEditing={isEditing}
              isLoading={isLoading}
              toggleEditSection={toggleEditSection}
            />
            
            {/* Community Section */}
            <CommunityInfoSection 
              form={form}
              isEditing={isEditing}
              isLoading={isLoading}
              selectedRunType={selectedRunType}
              selectedEventExp={selectedEventExp}
              toggleEditSection={toggleEditSection}
              setSelectedRunType={setSelectedRunType}
              setSelectedEventExp={setSelectedEventExp}
              addRunType={addRunType}
              removeRunType={removeRunType}
              addEventExperience={addEventExperience}
              removeEventExperience={removeEventExperience}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfilePage;
