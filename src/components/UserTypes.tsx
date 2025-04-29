
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const UserTypes: React.FC = () => {
  return (
    <section className="section">
      <div className="container-custom">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
            Perfect For
          </span>
          <h2 className="text-navy-800 mb-4">Built for both sides of the partnership</h2>
          <p className="text-navy-600 max-w-2xl mx-auto text-lg">
            Whether you're a run club looking for sponsors or a brand wanting to connect with the running community, 
            RunConnect is designed with your specific needs in mind.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Run Clubs */}
          <div className="bg-white rounded-xl overflow-hidden border shadow-sm">
            <div className="aspect-w-16 aspect-h-9 relative">
              <img 
                src="https://images.unsplash.com/photo-1486218119243-13883505764c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Running club members" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">For Run Clubs</h3>
                  <p className="text-white/90">Access brands that align with your club's values</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-navy-700">Create a club profile to showcase your community</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-navy-700">Browse relevant sponsorship opportunities in your area</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-navy-700">Receive offers tailored to your club's size and location</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-navy-700">Track performance metrics for your sponsors</span>
                </li>
              </ul>
              <Link to="/user-type">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Sign up as a Run Club
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Brands */}
          <div className="bg-white rounded-xl overflow-hidden border shadow-sm">
            <div className="aspect-w-16 aspect-h-9 relative">
              <img 
                src="https://images.unsplash.com/photo-1561069934-eee225952461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Brand promotion at running event" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">For Brands</h3>
                  <p className="text-white/90">Connect with engaged running communities</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-navy-700">Create a brand profile with your sponsorship goals</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-navy-700">Post sponsorship opportunities with detailed requirements</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-navy-700">Find run clubs that match your target audience demographics</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-navy-700">Measure campaign performance with detailed analytics</span>
                </li>
              </ul>
              <Link to="/user-type">
                <Button className="w-full bg-navy-700 hover:bg-navy-800">
                  Sign up as a Brand
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserTypes;
