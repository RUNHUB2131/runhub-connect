
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';

const AuthPage: React.FC = () => {
  const { action } = useParams<{ action: string }>();
  const isLogin = action === 'login';
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-navy-50 to-orange-50">
      <div className="container mx-auto p-4 sm:px-6 lg:px-8 flex flex-col flex-1">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">RC</span>
            </div>
            <span className="font-bold text-lg text-navy-800">RunConnect</span>
          </Link>
          <Link to="/" className="text-navy-700 hover:text-orange-500">
            Back to Home
          </Link>
        </div>
        
        <div className="flex-1 flex items-center justify-center py-12">
          <AuthForm defaultTab={isLogin ? 'login' : 'register'} />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
