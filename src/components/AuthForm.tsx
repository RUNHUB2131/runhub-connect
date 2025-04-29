
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthFormProps {
  action: 'login' | 'register';
  userType: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ action, userType }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    orgName: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "You have been logged in successfully.",
        variant: "default",
      });
      
      // Get the user's metadata to determine their type
      const { user } = data;
      const userMetadata = user?.user_metadata;
      const userTypeFromMetadata = userMetadata?.user_type || '';
      
      console.log("User metadata:", userMetadata);
      console.log("User type from metadata:", userTypeFromMetadata);
      
      // Store the user type in localStorage
      if (userTypeFromMetadata) {
        localStorage.setItem('userType', userTypeFromMetadata);
      } else if (userType) {
        localStorage.setItem('userType', userType);
      }
      
      // If we still don't have a userType in localStorage, check profiles table
      const storedUserType = localStorage.getItem('userType');
      if (!storedUserType) {
        // Check if user has a brand_profiles entry
        const { data: brandProfile } = await supabase
          .from('brand_profiles')
          .select('id')
          .eq('id', user?.id)
          .maybeSingle();
          
        if (brandProfile) {
          localStorage.setItem('userType', 'brand');
        } else {
          // Default to runclub if no brand profile found
          localStorage.setItem('userType', 'runclub');
        }
      }
      
      // Redirect based on user type
      const finalUserType = localStorage.getItem('userType') || 'runclub';
      if (finalUserType === 'brand') {
        navigate('/dashboard/brand');
      } else {
        navigate('/dashboard/opportunities');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to log in. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            user_type: userType,
            org_name: formData.orgName
          }
        }
      });
      
      if (authError) throw authError;
      
      // Store user type for routing
      localStorage.setItem('userType', userType);
      
      toast({
        title: "Registration successful!",
        description: "Your account has been created. Check your email for confirmation if required.",
        variant: "default",
      });
      
      // Create profile record based on user type
      if (userType === 'runclub') {
        const { error: profileError } = await supabase
          .from('runclub_profiles')
          .insert({
            id: authData.user.id,
            club_name: formData.orgName || 'My Run Club'
          });
          
        if (profileError) {
          console.error('Error creating run club profile:', profileError);
        }
      } else if (userType === 'brand') {
        const { error: brandError } = await supabase
          .from('brand_profiles')
          .insert({
            id: authData.user.id,
            company_name: formData.orgName || 'My Brand'
          });
          
        if (brandError) {
          console.error('Error creating brand profile:', brandError);
        }
      }
      
      // Redirect based on user type
      if (userType === 'brand') {
        navigate('/dashboard/brand');
      } else {
        navigate('/dashboard/opportunities');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "There was an error creating your account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-navy-800">
          {action === 'login' ? 'Welcome Back' : `Join as a ${userType === 'brand' ? 'Brand' : 'Run Club'}`}
        </h2>
        <p className="text-navy-600 mt-2">
          {action === 'login' 
            ? 'Sign in to access your RunConnect account' 
            : `Create your ${userType === 'brand' ? 'brand' : 'run club'} account`}
        </p>
      </div>
      
      {action === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="/forgot-password" className="text-sm text-orange-500 hover:text-orange-700">
                Forgot password?
              </a>
            </div>
            <Input 
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-orange-500 hover:bg-orange-600"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-navy-600">
              Don't have an account?{' '}
              <Link to="/user-type" className="text-orange-500 hover:text-orange-700">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input 
              id="name"
              name="name"
              placeholder="John Smith"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="orgName">{userType === 'brand' ? 'Brand Name' : 'Run Club Name'}</Label>
            <Input 
              id="orgName"
              name="orgName"
              placeholder={userType === 'brand' ? 'Your Brand Name' : 'Your Run Club Name'}
              required
              value={formData.orgName}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input 
              id="register-email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <Input 
              id="register-password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          
          <Button 
            type="submit" 
            className={`w-full ${userType === 'brand' ? 'bg-navy-700 hover:bg-navy-800' : 'bg-orange-500 hover:bg-orange-600'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
          
          <p className="text-sm text-center text-gray-600 mt-4">
            By registering, you agree to our{' '}
            <a href="/terms" className="text-orange-500 hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</a>
          </p>
          
          <div className="text-center mt-4">
            <p className="text-navy-600">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-orange-500 hover:text-orange-700">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default AuthForm;
