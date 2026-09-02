import React, { useRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'cyan' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btnRef.current.style.setProperty('--mouse-x', `${x}px`);
    btnRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs rounded-xl gap-1.5 font-bold',
    md: 'px-4.5 py-2 text-sm rounded-xl gap-2 font-bold',
    lg: 'px-6 py-3 text-base rounded-xl gap-2.5 font-black tracking-wide',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-sky-500 via-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white shadow-md shadow-sky-500/20 border border-sky-300/30 active:scale-[0.98]',
    secondary:
      'bg-white/60 hover:bg-white/90 text-sky-900 border border-sky-200 backdrop-blur-md shadow-xs active:scale-[0.98]',
    outline:
      'bg-white/40 hover:bg-sky-50 text-sky-800 border border-sky-300 hover:border-sky-400 shadow-xs active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-sky-100/50 text-sky-800 hover:text-sky-950 font-bold',
    cyan:
      'bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 shadow-md shadow-cyan-500/20 font-black active:scale-[0.98]',
    danger:
      'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300',
  };

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      className={`inline-flex items-center justify-center transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed cursor-glow-button ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
