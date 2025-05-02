
import React from 'react';
import { MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { RunclubProfile } from "@/api/types/opportunity.types";

interface ProfileHeaderProps {
  profile: RunclubProfile;
}

// Helper function to get initials from club name
const getInitials = (name: string | undefined | null) => {
  if (!name) return "RC";
  return name
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-16 w-16 text-lg">
        <AvatarFallback className="bg-primary text-primary-foreground">
          {getInitials(profile.club_name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-1">{profile.club_name || 'Unnamed Run Club'}</h3>
        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{profile.location || 'No location specified'}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
