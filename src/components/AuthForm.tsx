
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
      // For demo purposes, we'll now simulate a "real" login that knows the user type
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app with Supabase, we would fetch user metadata or profile after login
      // to determine the user type. For now, we'll simulate this.
      const userTypeFromLogin = localStorage.getItem('userType') || 'runclub';
      
      toast({
        title: "Success!",
        description: "You have been logged in successfully.",
        variant: "default",
      });
      
      // Redirect based on user type
      if (userTypeFromLogin === 'brand') {
        navigate('/dashboard/brand');
      } else {
        navigate('/dashboard/opportunities');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log in. Please check your credentials.",
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
      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would create the user in Supabase and store user metadata
      // For this demo, we'll store the user type in localStorage to simulate it
      localStorage.setItem('userType', userType);
      
      toast({
        title: "Registration successful!",
        description: "Your account has been created.",
        variant: "default",
      });
      
      // Redirect based on user type
      if (userType === 'brand') {
        navigate('/dashboard/brand');
      } else {
        navigate('/dashboard/opportunities');
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error creating your account.",
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
