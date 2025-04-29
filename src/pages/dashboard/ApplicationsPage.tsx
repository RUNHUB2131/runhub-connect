
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ApplicationsPage: React.FC = () => {
  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Applications</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Application History</CardTitle>
            <CardDescription>Track the status of your opportunity applications</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Applications dashboard coming soon. Here you'll be able to see all your submitted
              applications and their current status.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationsPage;
