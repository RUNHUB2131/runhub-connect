
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b">
      <div className="container-custom flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">RC</span>
            </div>
            <span className="font-bold text-lg md:text-xl text-navy-800">RunConnect</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-navy-700 hover:text-orange-500 font-medium">
            Home
          </Link>
          <Link to="/how-it-works" className="text-navy-700 hover:text-orange-500 font-medium">
            How It Works
          </Link>
          <Link to="/pricing" className="text-navy-700 hover:text-orange-500 font-medium">
            Pricing
          </Link>
          <Link to="/about" className="text-navy-700 hover:text-orange-500 font-medium">
            About
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          <Link to="/auth/login">
            <Button variant="outline">Log in</Button>
          </Link>
          <Link to="/user-type">
            <Button className="bg-orange-500 hover:bg-orange-600">Sign up</Button>
          </Link>
        </div>
        
        <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b animate-fade-in">
          <nav className="flex flex-col py-4 container-custom">
            <Link to="/" className="px-4 py-2 text-navy-700 hover:bg-gray-100 rounded-md" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/how-it-works" className="px-4 py-2 text-navy-700 hover:bg-gray-100 rounded-md" onClick={toggleMenu}>
              How It Works
            </Link>
            <Link to="/pricing" className="px-4 py-2 text-navy-700 hover:bg-gray-100 rounded-md" onClick={toggleMenu}>
              Pricing
            </Link>
            <Link to="/about" className="px-4 py-2 text-navy-700 hover:bg-gray-100 rounded-md" onClick={toggleMenu}>
              About
            </Link>
            <div className="flex flex-col gap-2 mt-4 px-4">
              <Link to="/auth/login" onClick={toggleMenu}>
                <Button variant="outline" className="w-full">Log in</Button>
              </Link>
              <Link to="/user-type" onClick={toggleMenu}>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">Sign up</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
