
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Ensure user type is checked
  useEffect(() => {
    const checkUserType = async () => {
      if (user && !localStorage.getItem('userType')) {
        // If userType isn't in localStorage, check brand_profiles
        try {
          const { data: brandProfile } = await supabase
            .from('brand_profiles')
            .select('id')
            .eq('id', user.id)
            .maybeSingle();
            
          if (brandProfile) {
            localStorage.setItem('userType', 'brand');
          } else {
            localStorage.setItem('userType', 'runclub');
          }
        } catch (error) {
          console.error('Error checking user type:', error);
          // Default to runclub if check fails
          localStorage.setItem('userType', 'runclub');
        }
      }
    };
    
    if (user) {
      checkUserType();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-lg font-medium">Loading...</span>
      </div>
    );
  }

  if (!user) {
    // Save the location they were trying to access so we can redirect after login
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
