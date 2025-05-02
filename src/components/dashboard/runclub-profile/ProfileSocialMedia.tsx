
import React from 'react';
import { Instagram, Twitter, Facebook } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { RunclubProfile } from "@/api/types/opportunity.types";

interface ProfileSocialMediaProps {
  profile: RunclubProfile;
}

const ProfileSocialMedia: React.FC<ProfileSocialMediaProps> = ({ profile }) => {
  if (!profile.social_media ||
      (!profile.social_media.instagram?.handle && 
       !profile.social_media.twitter?.handle && 
       !profile.social_media.facebook?.page)) {
    return null;
  }
  
  return (
    <>
      <Separator />
      <div>
        <h4 className="text-sm font-medium mb-3">Social Media</h4>
        <div className="grid grid-cols-1 gap-3">
          {profile.social_media.instagram?.handle && (
            <div className="flex items-center">
              <Instagram className="h-4 w-4 mr-2 text-pink-500" />
              <span className="font-medium">@{profile.social_media.instagram.handle}</span>
              {profile.social_media.instagram.followers && (
                <Badge variant="outline" className="ml-2">
                  {profile.social_media.instagram.followers} followers
                </Badge>
              )}
            </div>
          )}
          
          {profile.social_media.twitter?.handle && (
            <div className="flex items-center">
              <Twitter className="h-4 w-4 mr-2 text-blue-400" />
              <span className="font-medium">@{profile.social_media.twitter.handle}</span>
              {profile.social_media.twitter.followers && (
                <Badge variant="outline" className="ml-2">
                  {profile.social_media.twitter.followers} followers
                </Badge>
              )}
            </div>
          )}
          
          {profile.social_media.facebook?.page && (
            <div className="flex items-center">
              <Facebook className="h-4 w-4 mr-2 text-blue-600" />
              <span className="font-medium">{profile.social_media.facebook.page}</span>
              {profile.social_media.facebook.followers && (
                <Badge variant="outline" className="ml-2">
                  {profile.social_media.facebook.followers} followers
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileSocialMedia;
