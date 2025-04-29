
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, MapPin, Globe, Instagram, Twitter, Facebook } from "lucide-react";
import { fetchRunClubProfile } from '@/api/opportunityApi';

interface RunClubProfileModalProps {
  profileId: string;
  isOpen: boolean;
  onClose: () => void;
}

const RunClubProfileModal: React.FC<RunClubProfileModalProps> = ({ 
  profileId,
  isOpen,
  onClose
}) => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['runclub-profile', profileId],
    queryFn: async () => {
      const { data, error } = await fetchRunClubProfile(profileId);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!profileId && isOpen
  });
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Run Club Profile</DialogTitle>
          <DialogDescription>
            Details about this run club
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Loading profile...</p>
          </div>
        ) : profile ? (
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold mb-2">{profile.club_name || 'Unnamed Run Club'}</h3>
              <div className="flex items-center text-muted-foreground mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{profile.location || 'No location specified'}</span>
              </div>
              <div className="flex items-center text-muted-foreground mb-2">
                <Users className="h-4 w-4 mr-1" />
                <span>{profile.member_count || '0'} members</span>
              </div>
              {profile.website && (
                <div className="flex items-center text-muted-foreground mb-2">
                  <Globe className="h-4 w-4 mr-1" />
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {profile.website}
                  </a>
                </div>
              )}
            </div>
            
            <Separator />
            
            {/* Description */}
            {profile.description && (
              <div>
                <h4 className="text-sm font-medium mb-2">About</h4>
                <p className="text-gray-700">{profile.description}</p>
              </div>
            )}
            
            {/* Social Media */}
            {profile.social_media && (
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
            )}
            
            {/* Community Data */}
            {profile.community_data && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-3">Community</h4>
                  
                  {profile.community_data.average_group_size && (
                    <div className="mb-2">
                      <span className="text-gray-600">Average Group Size:</span> {profile.community_data.average_group_size}
                    </div>
                  )}
                  
                  {profile.community_data.core_demographic && (
                    <div className="mb-2">
                      <span className="text-gray-600">Core Demographic:</span> {profile.community_data.core_demographic}
                    </div>
                  )}
                  
                  {profile.community_data.run_types && profile.community_data.run_types.length > 0 && (
                    <div className="mb-2">
                      <span className="text-gray-600 block mb-1">Run Types:</span>
                      <div className="flex flex-wrap gap-2">
                        {profile.community_data.run_types.map((type: string, index: number) => (
                          <Badge key={index} variant="secondary">{type}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {profile.community_data.event_experience && profile.community_data.event_experience.length > 0 && (
                    <div>
                      <span className="text-gray-600 block mb-1">Event Experience:</span>
                      <div className="flex flex-wrap gap-2">
                        {profile.community_data.event_experience.map((exp: string, index: number) => (
                          <Badge key={index} variant="secondary">{exp}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p>No profile information available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RunClubProfileModal;
