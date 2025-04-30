
import React from 'react';
import { format } from 'date-fns';
import { MapPin, Users, User, Check, X } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
import type { Application } from '@/api/types/opportunity.types';

interface ApplicationsTableProps {
  applications: Application[];
  onViewProfile: (profileId: string) => void;
  onAcceptApplication: (applicationId: string) => void;
  onRejectApplication: (applicationId: string) => void;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  onViewProfile,
  onAcceptApplication,
  onRejectApplication
}) => {
  // Safe accessor functions for profile data
  const getClubName = (application: Application) => {
    return application?.runclub_profile?.club_name || 'Unnamed Run Club';
  };

  const getLocation = (application: Application) => {
    return application?.runclub_profile?.location || 'Unknown';
  };

  const getMemberCount = (application: Application) => {
    return application?.runclub_profile?.member_count || '0';
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'accepted':
        return "bg-green-100 text-green-800";
      case 'rejected':
        return "bg-red-100 text-red-800";
      case 'pending':
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleViewProfile = (application: Application) => {
    // Log the application data to help debug
    console.log("View profile for application:", application);
    
    // Use the profile ID if it exists, otherwise use the user_id
    const profileId = application.runclub_profile?.id || application.user_id;
    
    console.log("Profile ID to view:", profileId);
    
    if (profileId) {
      onViewProfile(profileId);
    } else {
      console.error("No profile ID or user ID available to view");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Run Club</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Applied On</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) => (
          <TableRow key={application.id}>
            <TableCell className="font-medium">
              {getClubName(application)}
            </TableCell>
            <TableCell className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
              {getLocation(application)}
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-gray-500" />
                {getMemberCount(application)}
              </div>
            </TableCell>
            <TableCell>
              <span className={`capitalize px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(application.status)}`}>
                {application.status || 'pending'}
              </span>
            </TableCell>
            <TableCell>{formatDate(application.created_at)}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleViewProfile(application)}
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ApplicationsTable;
