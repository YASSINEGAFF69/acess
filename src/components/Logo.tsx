import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {/* ACES Logo - represented using Lucide icons and styled text */}
      <div className="mr-2 text-secondary">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 10L18 4L31 10L18 16L5 10Z" fill="#F26E22" />
          <path d="M5 18L18 12L31 18L18 24L5 18Z" fill="#F26E22" />
          <path d="M5 26L18 20L31 26L18 32L5 26Z" fill="#F26E22" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-primary font-bold text-2xl tracking-wide">ACES</span>
        <span className="text-secondary text-xs tracking-wider">GET THE BEST</span>
      </div>
    </div>
  );
};

export default Logo;