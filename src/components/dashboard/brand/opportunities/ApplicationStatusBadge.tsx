
import React from 'react';

interface ApplicationStatusBadgeProps {
  status: string;
}

const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({ status }) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'accepted':
        return "bg-green-100 text-green-800";
      case 'rejected':
        return "bg-red-100 text-red-800";
      case 'pending':
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <span className={`capitalize px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(status)}`}>
      {status || 'pending'}
    </span>
  );
};

export default ApplicationStatusBadge;
