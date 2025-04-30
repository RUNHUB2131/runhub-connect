
import React from 'react';
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ApplicationsErrorStateProps {
  error: Error;
  onRetry: () => void;
}

const ApplicationsErrorState: React.FC<ApplicationsErrorStateProps> = ({ error, onRetry }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-red-600">
          <AlertCircle className="h-5 w-5 mr-2" />
          Error Loading Applications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-500 mb-4">There was a problem loading the applications: {error.message}</p>
        <Button onClick={onRetry} className="mt-4">
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApplicationsErrorState;
