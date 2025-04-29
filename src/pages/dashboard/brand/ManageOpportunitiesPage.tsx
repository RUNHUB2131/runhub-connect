
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ManageOpportunitiesPage: React.FC = () => {
  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Manage Opportunities</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Posted Opportunities</CardTitle>
            <CardDescription>Manage, edit, and track applications to your opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Opportunities management dashboard coming soon. Here you'll be able to view, edit, and track
              applications to your posted opportunities.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageOpportunitiesPage;
