import React from 'react';

interface StatusBadgeProps {
  status: 'ONLINE' | 'ACTIVE' | 'LOCAL' | 'VERIFIED' | 'RUNNING' | 'WARNING' | 'FAILED' | 'COMPLETED' | 'OFFLINE' | 'BUSY';
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
  const isGreen = ['ONLINE', 'ACTIVE', 'LOCAL', 'VERIFIED', 'COMPLETED'].includes(status);
  const isYellow = ['RUNNING', 'WARNING', 'BUSY'].includes(status);
  const isRed = ['FAILED', 'OFFLINE'].includes(status);

  const colorStyles = isGreen
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : isYellow
    ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
    : isRed
    ? 'bg-rose-50 text-rose-700 border-rose-200'
    : 'bg-sky-50 text-sky-800 border-sky-200';

  const dotColor = isGreen
    ? 'bg-emerald-500'
    : isYellow
    ? 'bg-amber-500'
    : isRed
    ? 'bg-rose-500'
    : 'bg-sky-500';

  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-sans font-bold rounded-full border shadow-xs ${colorStyles} ${padding}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${isYellow ? 'animate-ping' : ''}`} />
      {label || status}
    </span>
  );
};
