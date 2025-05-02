
import React from 'react';
import { getClubName, getDescription, truncateDescription } from '@/utils/runClubProfileUtils';
import RunClubSocialMedia from './RunClubSocialMedia';
import type { Application } from '@/api/types/opportunity.types';

interface RunClubInfoCellProps {
  application: Application;
}

const RunClubInfoCell: React.FC<RunClubInfoCellProps> = ({ application }) => {
  const website = application.runclub_profile?.website || '';
  const social = application.runclub_profile?.social_media || {};
  const instagram = social.instagram?.handle || '';
  const followers = social.instagram?.followers || 0;
  
  return (
    <div className="space-y-1">
      <div className="font-medium">{getClubName(application)}</div>
      {getDescription(application) && (
        <div className="text-xs text-gray-500 max-w-xs">
          {truncateDescription(getDescription(application))}
        </div>
      )}
      <RunClubSocialMedia 
        website={website}
        instagram={instagram}
        followers={followers}
      />
    </div>
  );
};

export default RunClubInfoCell;
