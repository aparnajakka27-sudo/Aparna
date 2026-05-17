"use client";
import React from 'react';

const Logo = ({ className = "", showText = true, size = 45 }: { className?: string, showText?: boolean, size?: number }) => {
  const handleClick = () => {
    window.location.href = '/';
  };

  return (
    <div 
      onClick={handleClick}
      className={`flex items-center gap-3 cursor-pointer group ${className}`}
    >
      {/* Precision SVG Logo from User Image */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm transition-transform duration-500 group-hover:rotate-12"
      >
        {/* Outer Pink Ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="40" 
          stroke="#FF4D6D" 
          strokeWidth="10"
        />
        {/* Inner Person Silhouette */}
        <circle cx="50" cy="42" r="10" fill="black" />
        <path 
          d="M32 72C32 64 38 58 50 58C62 58 68 64 68 72" 
          stroke="black" 
          strokeWidth="8" 
          strokeLinecap="round" 
        />
      </svg>

      {/* Brand Text Styling - Matches SS1 exactly */}
      {showText && (
        <h1 className="text-xl font-bold tracking-tight font-serif text-[#1a1a1a] leading-none whitespace-nowrap">
          DateForCode
        </h1>
      )}
    </div>
  );
};

export default Logo;

