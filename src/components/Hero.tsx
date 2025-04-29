
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-navy-50 to-orange-50">
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-[80vh] items-center py-16">
          <div className="flex flex-col space-y-6 animate-fade-up">
            <div className="inline-block">
              <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                Australia's Premier Sponsorship Platform
              </span>
            </div>
            
            <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl text-navy-900">
              Connecting <span className="text-orange-500">Runners</span> with <span className="text-orange-500">Brands</span>
            </h1>
            
            <p className="text-lg md:text-xl text-navy-600 max-w-lg">
              The first dedicated platform matching Australian run clubs with brands looking for authentic partnerships.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/auth/register?type=runclub">
                <Button className="bg-orange-500 hover:bg-orange-600 h-12 px-6 text-base">
                  Find sponsors
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link to="/auth/register?type=brand">
                <Button variant="outline" className="h-12 px-6 text-base">
                  Post sponsorship
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-navy-600">
              <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span>Trusted by over 250 run clubs across Australia</span>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-navy-50 to-transparent z-10"></div>
            <img
              alt="Runners at finish line with sponsors"
              className="mx-auto w-full h-auto object-cover rounded-lg shadow-xl"
              src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            />
          </div>
        </div>
      </div>
      
      {/* Blob shape decorations */}
      <div className="hidden md:block absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="hidden md:block absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-navy-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
    </div>
  );
};

export default Hero;
