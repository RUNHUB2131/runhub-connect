
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ProfileEmptyStateProps {
  onRetry: () => void;
}

const ProfileEmptyState: React.FC<ProfileEmptyStateProps> = ({ onRetry }) => {
  return (
    <div className="py-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <AlertCircle className="h-12 w-12 text-amber-500" />
        <p className="text-gray-600">No profile information available</p>
        <Button onClick={onRetry} variant="outline" className="mt-2">Retry</Button>
      </div>
    </div>
  );
};

export default ProfileEmptyState;
