
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import RunClubProfileModal from '@/components/dashboard/RunClubProfileModal';
import ApplicationsHeader from '@/components/dashboard/brand/opportunities/ApplicationsHeader';
import ApplicationsTable from '@/components/dashboard/brand/opportunities/ApplicationsTable';
import ApplicationsEmptyState from '@/components/dashboard/brand/opportunities/ApplicationsEmptyState';
import ApplicationsErrorState from '@/components/dashboard/brand/opportunities/ApplicationsErrorState';
import { useApplications } from '@/hooks/use-applications';

const OpportunityApplicationsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Debug logging for component mount and ID
  useEffect(() => {
    console.log("OpportunityApplicationsPage mounted with ID:", id);
  }, [id]);
  
  const {
    opportunity,
    applications,
    isLoadingOpportunity,
    isLoadingApplications,
    applicationsError,
    isRefreshing,
    selectedProfileId,
    handleRefresh,
    handleViewProfile,
    handleAcceptApplication,
    handleRejectApplication,
    handleCloseModal
  } = useApplications(id);

  // Refetch on mount to ensure we have the latest data
  useEffect(() => {
    if (id) {
      console.log("Initial fetch for applications with ID:", id);
      handleRefresh();
    }
  }, [id]);

  if (isLoadingOpportunity || isLoadingApplications) {
    return (
      <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <ApplicationsHeader
          title={opportunity?.title || ''}
          description={opportunity?.description || ''}
          isRefreshing={isRefreshing}
          onBackClick={() => navigate('/dashboard/brand/manage-opportunities')}
          onRefresh={handleRefresh}
        />

        {applicationsError ? (
          <ApplicationsErrorState 
            error={applicationsError} 
            onRetry={handleRefresh} 
          />
        ) : applications && applications.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>Run Club Applications ({applications.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ApplicationsTable
                applications={applications}
                onViewProfile={handleViewProfile}
                onAcceptApplication={handleAcceptApplication}
                onRejectApplication={handleRejectApplication}
              />
            </CardContent>
          </Card>
        ) : (
          <ApplicationsEmptyState onRefresh={handleRefresh} />
        )}

        {selectedProfileId && (
          <RunClubProfileModal
            profileId={selectedProfileId}
            isOpen={!!selectedProfileId}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default OpportunityApplicationsPage;
