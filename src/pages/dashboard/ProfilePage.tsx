
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ProfilePage: React.FC = () => {
  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Run Club Profile</CardTitle>
            <CardDescription>Complete your profile information to attract brands</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Profile editor coming soon. Here you'll be able to add your run club details,
              upload photos, and highlight what makes your community special.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
