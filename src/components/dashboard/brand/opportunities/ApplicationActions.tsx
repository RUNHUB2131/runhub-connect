
import React from 'react';
import { User, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getClubName } from '@/utils/runClubProfileUtils';
import type { Application } from '@/api/types/opportunity.types';

interface ApplicationActionsProps {
  application: Application;
  onViewProfile: (profileId: string) => void;
  onAcceptApplication: (applicationId: string) => void;
  onRejectApplication: (applicationId: string) => void;
}

const ApplicationActions: React.FC<ApplicationActionsProps> = ({
  application,
  onViewProfile,
  onAcceptApplication,
  onRejectApplication
}) => {
  const handleViewProfile = () => {
    // Log the application data to help debug
    console.log("View profile for application:", application);
    
    if (!application.runclub_profile) {
      console.error("No runclub_profile available for this application");
      return;
    }
    
    // Use the profile ID from the runclub_profile
    const profileId = application.runclub_profile.id;
    
    console.log("Profile ID to view:", profileId);
    
    if (profileId) {
      onViewProfile(profileId);
    } else {
      console.error("No profile ID available to view");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="sm"
        disabled={!application.runclub_profile}
        onClick={handleViewProfile}
        title={application.runclub_profile ? "View profile" : "Profile not available"}
      >
        <User className="h-4 w-4 mr-1" />
        View Profile
      </Button>
      
      {application.status === 'pending' && (
        <>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <Check className="h-4 w-4 mr-1" />
                Accept
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Accept Application</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to accept this application from {getClubName(application)}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onAcceptApplication(application.id)}>Accept</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reject Application</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reject this application from {getClubName(application)}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onRejectApplication(application.id)}>Reject</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};

export default ApplicationActions;
