import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import Logo from './Logo';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle smooth scrolling for hash links
  const handleHashNavigation = (hash: string) => {
    if (location.pathname !== '/') {
      // If not on home page, navigate to home first then scroll
      window.location.href = `/${hash}`;
    } else {
      // If on home page, scroll directly
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Logo className={`h-12 w-auto ${isScrolled ? 'text-primary' : 'text-primary'}`} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <NavLink to="/" label="Home" isScrolled={isScrolled} onHashClick={handleHashNavigation} />
          <NavLink to="/#packages" label="Packages" isScrolled={isScrolled} onHashClick={handleHashNavigation} />
          <NavLink to="/#destinations" label="Destinations" isScrolled={isScrolled} onHashClick={handleHashNavigation} />
          <NavLink to="/#activities" label="Activities" isScrolled={isScrolled} onHashClick={handleHashNavigation} />
          <NavLink to="/#experiences" label="Experiences" isScrolled={isScrolled} onHashClick={handleHashNavigation} />
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button
            onClick={() => handleHashNavigation('#packages')}
            className={`button-primary ${isScrolled ? '' : 'bg-white text-secondary hover:bg-gray-100'}`}
          >
            Book Now
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className={`h-6 w-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`} />
          ) : (
            <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`absolute top-full left-0 right-0 bg-white shadow-md transition-all duration-300 md:hidden ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <MobileNavLink to="/" label="Home" onHashClick={handleHashNavigation} />
          <MobileNavLink to="/#packages" label="Packages" onHashClick={handleHashNavigation} />
          <MobileNavLink to="/#destinations" label="Destinations" onHashClick={handleHashNavigation} />
          <MobileNavLink to="/#activities" label="Activities" onHashClick={handleHashNavigation} />
          <MobileNavLink to="/#experiences" label="Experiences" onHashClick={handleHashNavigation} />
          <button 
            onClick={() => handleHashNavigation('#packages')}
            className="button-primary w-full text-center"
          >
            Book Now
          </button>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  isScrolled: boolean;
  onHashClick: (hash: string) => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, isScrolled, onHashClick }) => {
  const location = useLocation();
  
  // Check if this is a hash link
  const isHashLink = to.startsWith('/#');
  const isActive = isHashLink 
    ? location.pathname === '/' && location.hash === to.substring(1)
    : location.pathname === to;
  
  const handleClick = (e: React.MouseEvent) => {
    if (isHashLink) {
      e.preventDefault();
      onHashClick(to.substring(1)); // Remove the leading '/'
    }
  };
  
  return (
    <button
      onClick={handleClick}
      className={`relative font-medium transition-colors duration-300 ${
        isActive 
          ? 'text-secondary' 
          : isScrolled 
            ? 'text-gray-800 hover:text-secondary' 
            : 'text-white hover:text-secondary'
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary transform -translate-y-1"></span>
      )}
    </button>
  );
};

interface MobileNavLinkProps {
  to: string;
  label: string;
  onHashClick: (hash: string) => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, label, onHashClick }) => {
  const location = useLocation();
  
  // Check if this is a hash link
  const isHashLink = to.startsWith('/#');
  const isActive = isHashLink 
    ? location.pathname === '/' && location.hash === to.substring(1)
    : location.pathname === to;
  
  const handleClick = (e: React.MouseEvent) => {
    if (isHashLink) {
      e.preventDefault();
      onHashClick(to.substring(1)); // Remove the leading '/'
    }
  };
  
  if (isHashLink) {
    return (
      <button 
        onClick={handleClick}
        className={`py-2 px-4 font-medium rounded-lg text-left w-full ${
          isActive ? 'bg-primary/10 text-primary' : 'text-gray-800 hover:bg-gray-100'
        }`}
      >
        {label}
      </button>
    );
  }
  
  return (
    <Link 
      to={to}
      className={`py-2 px-4 font-medium rounded-lg ${
        isActive ? 'bg-primary/10 text-primary' : 'text-gray-800 hover:bg-gray-100'
      }`}
    >
      {label}
    </Link>
  );
};

export default Header;