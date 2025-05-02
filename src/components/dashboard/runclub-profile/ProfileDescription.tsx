
import React from 'react';
import { Separator } from "@/components/ui/separator";

interface ProfileDescriptionProps {
  description?: string | null;
}

const ProfileDescription: React.FC<ProfileDescriptionProps> = ({ description }) => {
  if (!description) return null;
  
  return (
    <>
      <Separator />
      <div>
        <h4 className="text-sm font-medium mb-2">About</h4>
        <p className="text-gray-700">{description}</p>
      </div>
    </>
  );
};

export default ProfileDescription;
