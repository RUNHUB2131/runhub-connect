
import React from 'react';
import { MapPin, Users } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import type { Application } from '@/api/types/opportunity.types';
import { getLocation, getMemberCount, formatDate } from '@/utils/runClubProfileUtils';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import RunClubInfoCell from './RunClubInfoCell';
import ApplicationActions from './ApplicationActions';

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
          <TableRow key={application.id} className="group">
            <TableCell>
              <RunClubInfoCell application={application} />
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
              <ApplicationStatusBadge status={application.status || 'pending'} />
            </TableCell>
            <TableCell>{formatDate(application.created_at)}</TableCell>
            <TableCell>
              <ApplicationActions
                application={application}
                onViewProfile={onViewProfile}
                onAcceptApplication={onAcceptApplication}
                onRejectApplication={onRejectApplication}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ApplicationsTable;
