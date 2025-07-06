import React from 'react';
import logo from "..//assets/images/logo1.png"; // Adjust path based on your project structure


interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {/* ACES Logo - represented using Lucide icons and styled text */}
      <div className="mr-2 text-secondary">
  <img src={logo} alt="ACES Logo" width={36} height={36} />
</div>

      <div className="flex flex-col">
        <span className="text-primary font-bold text-2xl tracking-wide">ACES</span>
        <span className="text-secondary text-xs tracking-wider">GET THE BEST</span>
      </div>
    </div>
  );
};

export default Logo;