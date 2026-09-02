import React from 'react';

interface SecurityIndicatorProps {
  compact?: boolean;
}

export const SecurityIndicator: React.FC<SecurityIndicatorProps> = () => {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-sky-200 text-sky-900 text-xs font-sans font-bold select-none shadow-xs backdrop-blur-md">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
      <span>Local</span>
    </div>
  );
};
