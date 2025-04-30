
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";

interface ApplicationsEmptyStateProps {
  onRefresh: () => void;
}

const ApplicationsEmptyState: React.FC<ApplicationsEmptyStateProps> = ({ onRefresh }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-gray-400" />
          <span>No Applications Yet</span>
        </CardTitle>
        <CardDescription>
          There are currently no applications for this opportunity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          When run clubs apply for this opportunity, they will appear here.
        </p>
        <Button onClick={onRefresh} variant="outline">
          Refresh
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApplicationsEmptyState;
