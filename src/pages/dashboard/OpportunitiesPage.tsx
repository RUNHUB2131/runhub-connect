
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const OpportunitiesPage: React.FC = () => {
  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Browse Opportunities</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Available Opportunities</CardTitle>
            <CardDescription>Find partnerships with brands that align with your run club</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Opportunities listing coming soon. Here you'll be able to browse and filter
              sponsorship and partnership opportunities from various brands.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OpportunitiesPage;
