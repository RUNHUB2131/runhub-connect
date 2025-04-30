
import React from 'react';
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApplicationsHeaderProps {
  title: string;
  description: string;
  isRefreshing: boolean;
  onBackClick: () => void;
  onRefresh: () => void;
}

const ApplicationsHeader: React.FC<ApplicationsHeaderProps> = ({
  title,
  description,
  isRefreshing,
  onBackClick,
  onRefresh
}) => {
  return (
    <>
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={onBackClick}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to opportunities
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{title} - Applications</h1>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="flex justify-end mb-4">
        <Button 
          onClick={onRefresh} 
          variant="outline" 
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>
    </>
  );
};

export default ApplicationsHeader;
