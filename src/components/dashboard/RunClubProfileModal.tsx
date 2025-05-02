
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ProfileLoadingState from './runclub-profile/ProfileLoadingState';
import ProfileErrorState from './runclub-profile/ProfileErrorState';
import ProfileEmptyState from './runclub-profile/ProfileEmptyState';
import ProfileHeader from './runclub-profile/ProfileHeader';
import ProfileKeyInfo from './runclub-profile/ProfileKeyInfo';
import ProfileDescription from './runclub-profile/ProfileDescription';
import ProfileRunTypes from './runclub-profile/ProfileRunTypes';
import ProfileSocialMedia from './runclub-profile/ProfileSocialMedia';
import { useRunClubProfile } from '@/hooks/use-run-club-profile';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/hooks/queries/keys';

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
  const queryClient = useQueryClient();
  // Only fetch when the modal is open
  const { profile, isLoading, error, refetch } = useRunClubProfile(isOpen ? profileId : null);

  // Prefetch when profileId changes but modal is not yet open
  React.useEffect(() => {
    if (!isOpen && profileId) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.profiles.runclub(profileId),
        queryFn: () => Promise.resolve(undefined)
      });
    }
  }, [profileId, isOpen, queryClient]);

  const handleRetry = () => {
    refetch();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Run Club Profile</DialogTitle>
          <DialogDescription>
            Detailed information about this run club
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <ProfileLoadingState />
        ) : error ? (
          <ProfileErrorState error={error} onRetry={handleRetry} />
        ) : !profile ? (
          <ProfileEmptyState onRetry={handleRetry} />
        ) : (
          <div className="space-y-6">
            <ProfileHeader profile={profile} />
            <ProfileKeyInfo profile={profile} />
            <ProfileDescription profile={profile} />
            {profile.community_data && <ProfileRunTypes profile={profile} />}
            <ProfileSocialMedia profile={profile} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RunClubProfileModal;
