
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface ApplicationsEmptyStateProps {
  onRefresh: () => void;
}

const ApplicationsEmptyState: React.FC<ApplicationsEmptyStateProps> = ({ onRefresh }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No Applications Yet</CardTitle>
        <CardDescription>
          There are currently no applications for this opportunity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          When run clubs apply for this opportunity, they will appear here.
        </p>
        <Button onClick={onRefresh} className="mt-4">
          Refresh
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApplicationsEmptyState;
