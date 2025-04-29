
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Club, Briefcase } from "lucide-react";

const UserTypeSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleTypeSelection = (type: 'runclub' | 'brand') => {
    navigate(`/auth/register?type=${type}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="container mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-600 mb-10">RUNHUB</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Who are you joining as?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Choose your account type to get started with RUNHUB. You can't change this later, so please select carefully.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Run Club Card */}
          <Card 
            className="p-8 border-2 hover:border-blue-500 transition-all cursor-pointer flex flex-col items-center"
            onClick={() => handleTypeSelection('runclub')}
          >
            <div className="bg-blue-100 p-6 rounded-full mb-4">
              <Club size={40} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Run Club</h3>
            <p className="text-gray-600 text-center">
              For running clubs looking to connect with brands and find sponsorship opportunities
            </p>
          </Card>

          {/* Brand Card */}
          <Card 
            className="p-8 border-2 hover:border-blue-500 transition-all cursor-pointer flex flex-col items-center"
            onClick={() => handleTypeSelection('brand')}
          >
            <div className="bg-blue-100 p-6 rounded-full mb-4">
              <Briefcase size={40} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Brand</h3>
            <p className="text-gray-600 text-center">
              For brands looking to partner with running clubs and create sponsorship opportunities
            </p>
          </Card>
        </div>

        <div className="mt-10">
          <Link to="/" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;
