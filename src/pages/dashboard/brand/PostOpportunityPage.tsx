
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PostOpportunityPage: React.FC = () => {
  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Post an Opportunity</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Create Opportunity</CardTitle>
            <CardDescription>Create sponsorship opportunities for run clubs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Opportunity creation form coming soon. Here you'll be able to create and publish
              sponsorship opportunities for run clubs to apply for.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostOpportunityPage;
