import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  badgeText?: string;
  badgeType?: 'success' | 'info' | 'warning';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
}) => {
  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between hover:border-sky-300 transition-all duration-200">
      <div className="flex items-center justify-between text-[#0C4A6E]">
        <div className="text-4xl font-black tracking-tight font-sans text-[#0C4A6E]">
          {value}
        </div>
        {icon && <div className="p-2 rounded-xl bg-sky-100/60 text-sky-700 border border-sky-200/60">{icon}</div>}
      </div>

      <div className="mt-3">
        <div className="text-xs font-bold text-sky-900 font-sans">
          {title}
        </div>
        {subtitle && <div className="text-[11px] text-sky-700/80 font-sans mt-0.5">{subtitle}</div>}
      </div>
    </div>
  );
};
