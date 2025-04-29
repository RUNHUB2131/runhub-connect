
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthFormProps {
  defaultTab?: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ defaultTab = 'login' }) => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'runclub'; // Default to run club if not specified
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
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  
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
      // For demo purposes, simulate a login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo success
      toast({
        title: "Success!",
        description: "You have been logged in successfully.",
        variant: "default",
      });
      
      navigate('/dashboard');
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
      // For demo purposes, simulate a registration delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo success
      toast({
        title: "Registration successful!",
        description: "Your account has been created.",
        variant: "default",
      });
      
      navigate('/dashboard');
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
          {activeTab === 'login' ? 'Welcome Back' : `Join as a ${userType === 'brand' ? 'Brand' : 'Run Club'}`}
        </h2>
        <p className="text-navy-600 mt-2">
          {activeTab === 'login' 
            ? 'Sign in to access your RunConnect account' 
            : `Create your ${userType === 'brand' ? 'brand' : 'run club'} account`}
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Log In</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
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
          </form>
        </TabsContent>
        
        <TabsContent value="register">
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
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
