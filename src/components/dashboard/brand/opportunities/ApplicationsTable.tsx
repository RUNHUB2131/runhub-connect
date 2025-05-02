
import React from 'react';
import { format } from 'date-fns';
import { MapPin, Users, User, Check, X, Globe, Instagram } from "lucide-react";
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
  // Debug log to see what data we're receiving
  console.log("Applications data in table:", applications);

  // Safe accessor functions for profile data
  const getClubName = (application: Application) => {
    if (!application?.runclub_profile) return 'Unnamed Run Club';
    return application.runclub_profile.club_name || 'Unnamed Run Club';
  };

  const getLocation = (application: Application) => {
    if (!application?.runclub_profile) return 'Unknown';
    return application.runclub_profile.location || 'Unknown';
  };

  const getMemberCount = (application: Application) => {
    if (!application?.runclub_profile) return '0';
    return application.runclub_profile.member_count?.toString() || '0';
  };
  
  const getDescription = (application: Application) => {
    if (!application?.runclub_profile) return 'No description available';
    return application.runclub_profile.description || 'No description available';
  };
  
  const getWebsite = (application: Application) => {
    if (!application?.runclub_profile) return '';
    return application.runclub_profile.website || '';
  };
  
  const getSocialMedia = (application: Application) => {
    if (!application?.runclub_profile || !application.runclub_profile.social_media) {
      return { instagram: '', followers: 0 };
    }
    
    const social = application.runclub_profile.social_media;
    return {
      instagram: social.instagram?.handle || '',
      followers: social.instagram?.followers || 0
    };
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

  const truncateDescription = (description: string, maxLength = 100) => {
    if (!description || description.length <= maxLength) return description;
    return `${description.substring(0, maxLength)}...`;
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
        {applications.map((application) => {
          const social = getSocialMedia(application);
          return (
            <TableRow key={application.id} className="group">
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{getClubName(application)}</div>
                  {getDescription(application) && (
                    <div className="text-xs text-gray-500 max-w-xs">
                      {truncateDescription(getDescription(application))}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 flex flex-wrap items-center gap-2 pt-1">
                    {getWebsite(application) && (
                      <a 
                        href={getWebsite(application)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                      >
                        <Globe className="h-3 w-3" /> Website
                      </a>
                    )}
                    {social.instagram && (
                      <div className="flex items-center gap-1">
                        <Instagram className="h-3 w-3 text-pink-500" />
                        <span className="text-gray-600">@{social.instagram}</span>
                        {social.followers > 0 && (
                          <span className="text-gray-400">({social.followers})</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  {getLocation(application)}
                </div>
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
                    disabled={!application.runclub_profile}
                    onClick={() => application.runclub_profile && handleViewProfile(application)}
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
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ApplicationsTable;
