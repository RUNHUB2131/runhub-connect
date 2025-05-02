
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { fetchRunClubProfile } from '@/api/runClubProfileManager';
import { useToast } from "@/hooks/use-toast";

// Import our new component files
import ProfileHeader from './runclub-profile/ProfileHeader';
import ProfileKeyInfo from './runclub-profile/ProfileKeyInfo';
import ProfileDescription from './runclub-profile/ProfileDescription';
import ProfileRunTypes from './runclub-profile/ProfileRunTypes';
import ProfileSocialMedia from './runclub-profile/ProfileSocialMedia';
import ProfileErrorState from './runclub-profile/ProfileErrorState';
import ProfileEmptyState from './runclub-profile/ProfileEmptyState';
import ProfileLoadingState from './runclub-profile/ProfileLoadingState';

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
  const { toast } = useToast();
  console.log("RunClubProfileModal render with profileId:", profileId);
  
  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ['runclub-profile', profileId],
    queryFn: async () => {
      console.log("Fetching profile for ID:", profileId);
      if (!profileId || profileId.trim() === '') {
        throw new Error("Invalid profile ID");
      }
      
      const { data, error } = await fetchRunClubProfile(profileId);
      if (error) {
        console.error("Error fetching profile:", error);
        throw new Error(error);
      }
      console.log("Fetched profile data:", data);
      return data;
    },
    enabled: !!profileId && isOpen && profileId.trim().length > 0,
    retry: 1,
    meta: {
      onError: (err: Error) => {
        console.error("Profile fetch error in query:", err);
        toast({
          title: "Error loading profile",
          description: err.message,
          variant: "destructive",
        });
      }
    }
  });
  
  // Debug logging for profileId changes
  useEffect(() => {
    if (isOpen && profileId) {
      console.log("Profile modal opened with ID:", profileId);
    }
  }, [isOpen, profileId]);

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
          <ProfileLoadingState />
        ) : error ? (
          <ProfileErrorState error={error} onRetry={refetch} />
        ) : profile ? (
          <div className="space-y-6">
            {/* Header with Avatar */}
            <ProfileHeader profile={profile} />
            
            {/* Key Info */}
            <ProfileKeyInfo profile={profile} />
            
            {/* Description */}
            <ProfileDescription description={profile.description} />
            
            {/* Run Types & Event Experience */}
            <ProfileRunTypes profile={profile} />
            
            {/* Social Media */}
            <ProfileSocialMedia profile={profile} />
          </div>
        ) : (
          <ProfileEmptyState onRetry={refetch} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RunClubProfileModal;
