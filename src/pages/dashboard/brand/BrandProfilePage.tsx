
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BrandProfilePage: React.FC = () => {
  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Brand Profile</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Company Profile</CardTitle>
            <CardDescription>Complete your brand profile to attract run clubs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Profile editor coming soon. Here you'll be able to add your brand details,
              upload logos, and highlight what makes your company unique.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandProfilePage;
