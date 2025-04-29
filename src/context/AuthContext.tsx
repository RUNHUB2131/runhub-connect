
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  userType: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          // Check for user type
          const userMetadata = currentUser.user_metadata;
          const typeFromMetadata = userMetadata?.user_type;
          
          if (typeFromMetadata) {
            localStorage.setItem('userType', typeFromMetadata);
            setUserType(typeFromMetadata);
          } else {
            // Check brand_profiles table
            try {
              const { data: brandProfile } = await supabase
                .from('brand_profiles')
                .select('id')
                .eq('id', currentUser.id)
                .maybeSingle();
                
              if (brandProfile) {
                localStorage.setItem('userType', 'brand');
                setUserType('brand');
              } else {
                localStorage.setItem('userType', 'runclub');
                setUserType('runclub');
              }
            } catch (error) {
              console.error("Error checking user profile:", error);
              // Default to stored value or runclub
              const storedType = localStorage.getItem('userType') || 'runclub';
              setUserType(storedType);
            }
          }
        } else {
          setUserType(null);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        
        const currentUser = data.session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          // Check for user type
          const storedType = localStorage.getItem('userType');
          if (storedType) {
            setUserType(storedType);
          } else {
            try {
              const { data: brandProfile } = await supabase
                .from('brand_profiles')
                .select('id')
                .eq('id', currentUser.id)
                .maybeSingle();
                
              if (brandProfile) {
                localStorage.setItem('userType', 'brand');
                setUserType('brand');
              } else {
                localStorage.setItem('userType', 'runclub');
                setUserType('runclub');
              }
            } catch (error) {
              console.error("Error checking user profile:", error);
              setUserType('runclub');
            }
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('userType');
      setUserType(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut, userType }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
