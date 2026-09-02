import React, { useRef } from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  hoverEffect?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  gradient = false,
  hoverEffect = false,
  glow = false,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const baseStyle = gradient
    ? 'glass-gradient-card'
    : 'glass-panel';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`rounded-2xl p-6 relative overflow-hidden transition-all duration-300 cursor-glow-card ${baseStyle} ${
        hoverEffect ? 'hover:border-sky-300 hover:shadow-lg cursor-pointer' : ''
      } ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sky-300/30 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
