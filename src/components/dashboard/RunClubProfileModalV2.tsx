
import React from 'react';
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ProfileHeader from './runclub-profile/ProfileHeader';
import ProfileDescription from './runclub-profile/ProfileDescription';
import ProfileKeyInfo from './runclub-profile/ProfileKeyInfo';
import ProfileRunTypes from './runclub-profile/ProfileRunTypes';
import ProfileSocialMedia from './runclub-profile/ProfileSocialMedia';
import ProfileLoadingState from './runclub-profile/ProfileLoadingState';
import ProfileErrorState from './runclub-profile/ProfileErrorState';
import ProfileEmptyState from './runclub-profile/ProfileEmptyState';
import { useRunClubProfile } from '@/hooks/use-run-club-profile';

interface RunClubProfileModalProps {
  profileId: string;
  isOpen: boolean;
  onClose: () => void;
}

const RunClubProfileModalV2: React.FC<RunClubProfileModalProps> = ({ 
  profileId, 
  isOpen, 
  onClose 
}) => {
  const { profile, isLoading, error, refetch } = useRunClubProfile(isOpen ? profileId : null);

  const handleRetry = () => {
    refetch();
  };

  const renderContent = () => {
    if (isLoading) {
      return <ProfileLoadingState />;
    }

    if (error) {
      return <ProfileErrorState error={error} onRetry={handleRetry} />;
    }

    if (!profile) {
      return <ProfileEmptyState onRetry={handleRetry} />;
    }

    return (
      <>
        <ProfileHeader profile={profile} />
        <div className="grid gap-6">
          <ProfileDescription profile={profile} />
          <ProfileKeyInfo profile={profile} />
          <ProfileRunTypes profile={profile} />
          <ProfileSocialMedia profile={profile} />
        </div>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle>Run Club Profile</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="py-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RunClubProfileModalV2;
