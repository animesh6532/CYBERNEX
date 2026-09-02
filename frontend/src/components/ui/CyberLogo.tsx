import React from 'react';

interface CyberLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const CyberLogo: React.FC<CyberLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-11 h-11',
  };

  const titleSizes = {
    sm: 'text-base font-bold tracking-wider',
    md: 'text-lg font-black tracking-widest',
    lg: 'text-2xl font-black tracking-widest',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Minimal Architectural Shield Logo */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]}`}>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-sky-400/30 to-cyan-400/20 blur-[3px]" />
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full text-sky-600 drop-shadow-[0_2px_6px_rgba(56,189,248,0.25)]"
        >
          <polygon
            points="20,3 35,11 35,29 20,37 5,29 5,11"
            stroke="currentColor"
            strokeWidth="2"
            fill="rgba(255, 255, 255, 0.85)"
          />
          <polygon points="20,11 28,15 28,25 20,29 12,25 12,15" fill="rgba(186, 230, 253, 0.5)" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="2.5" fill="#0C4A6E" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className={`text-[#0C4A6E] font-black tracking-widest ${titleSizes[size]}`}>
          CYBERNEX
        </div>
        {showSubtitle && (
          <span className="text-[9px] uppercase tracking-[0.22em] font-bold text-sky-600/90 -mt-1">
            SOVEREIGN AI WORKBENCH
          </span>
        )}
      </div>
    </div>
  );
};
