
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { RunclubProfile } from "@/api/types/opportunity.types";

interface ProfileRunTypesProps {
  profile: RunclubProfile;
}

const ProfileRunTypes: React.FC<ProfileRunTypesProps> = ({ profile }) => {
  // Early return if no community data or neither run types nor event experience exists
  if (!profile.community_data || 
      (!profile.community_data.run_types?.length && 
       !profile.community_data.event_experience?.length)) {
    return null;
  }
  
  return (
    <>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profile.community_data.run_types && profile.community_data.run_types.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Run Types</h4>
            <div className="flex flex-wrap gap-2">
              {profile.community_data.run_types.map((type: string, index: number) => (
                <Badge key={index} variant="secondary">{type}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {profile.community_data.event_experience && profile.community_data.event_experience.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Event Experience</h4>
            <div className="flex flex-wrap gap-2">
              {profile.community_data.event_experience.map((exp: string, index: number) => (
                <Badge key={index} variant="secondary">{exp}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileRunTypes;
