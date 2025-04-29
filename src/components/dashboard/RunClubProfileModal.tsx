
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
import { Users, MapPin, Globe, Instagram, Twitter, Facebook, Calendar, Clock } from "lucide-react";
import { fetchRunClubProfile } from '@/api/opportunityApi';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
            {/* Header with Avatar */}
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
            
            <Separator />
            
            {/* Key Info */}
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
            
            {/* Description */}
            {profile.description && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-2">About</h4>
                  <p className="text-gray-700">{profile.description}</p>
                </div>
              </>
            )}
            
            {/* Run Types & Event Experience */}
            {profile.community_data && (profile.community_data.run_types?.length > 0 || profile.community_data.event_experience?.length > 0) && (
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
            )}
            
            {/* Social Media */}
            {profile.social_media && (profile.social_media.instagram?.handle || profile.social_media.twitter?.handle || profile.social_media.facebook?.page) && (
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
