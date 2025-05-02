
import React from 'react';
import { Users, Globe } from "lucide-react";
import type { RunclubProfile } from "@/api/types/opportunity.types";

interface ProfileKeyInfoProps {
  profile: RunclubProfile;
}

const ProfileKeyInfo: React.FC<ProfileKeyInfoProps> = ({ profile }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="text-sm font-medium mb-2">Club Information</h4>
        <div className="space-y-2">
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span>{profile.member_count || '0'} members</span>
          </div>
          {profile.website && (
            <div className="flex items-center text-muted-foreground">
              <Globe className="h-4 w-4 mr-2" />
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {profile.website}
              </a>
            </div>
          )}
        </div>
      </div>
      
      {profile.community_data && (
        <div>
          <h4 className="text-sm font-medium mb-2">Community Demographics</h4>
          <div className="space-y-2">
            {profile.community_data.average_group_size && (
              <div className="flex items-center text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                <span>Average group size: {profile.community_data.average_group_size}</span>
              </div>
            )}
            {profile.community_data.core_demographic && (
              <div className="flex items-center text-muted-foreground">
                <span>Core demographic: {profile.community_data.core_demographic}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileKeyInfo;
