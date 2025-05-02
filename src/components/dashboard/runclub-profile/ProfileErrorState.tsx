
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ProfileErrorStateProps {
  error: Error | unknown;
  onRetry: () => void;
}

const ProfileErrorState: React.FC<ProfileErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="py-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <p className="text-red-500 font-medium mb-1">Error loading profile</p>
          <p className="text-sm text-gray-600 mb-4">{String(error)}</p>
          <Button 
            onClick={onRetry} 
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileErrorState;
