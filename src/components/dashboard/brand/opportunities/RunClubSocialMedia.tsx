
import React from 'react';
import { Globe, Instagram } from "lucide-react";

interface RunClubSocialMediaProps {
  website?: string;
  instagram?: string;
  followers?: number;
}

const RunClubSocialMedia: React.FC<RunClubSocialMediaProps> = ({ 
  website, 
  instagram, 
  followers 
}) => {
  return (
    <div className="text-xs text-gray-400 flex flex-wrap items-center gap-2 pt-1">
      {website && (
        <a 
          href={website} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
        >
          <Globe className="h-3 w-3" /> Website
        </a>
      )}
      {instagram && (
        <div className="flex items-center gap-1">
          <Instagram className="h-3 w-3 text-pink-500" />
          <span className="text-gray-600">@{instagram}</span>
          {followers && followers > 0 && (
            <span className="text-gray-400">({followers})</span>
          )}
        </div>
      )}
    </div>
  );
};

export default RunClubSocialMedia;
