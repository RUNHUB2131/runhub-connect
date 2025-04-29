
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MessagesPage: React.FC = () => {
  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>Message functionality will be available in a future update</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The messaging feature is currently under development. Soon you'll be able to
              communicate directly with brands through this platform.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;
