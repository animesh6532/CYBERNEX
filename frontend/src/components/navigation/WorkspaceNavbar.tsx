import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { User, Menu, X } from 'lucide-react';
import { CyberLogo } from '../ui/CyberLogo';

export const WorkspaceNavbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Workbench', path: '/workbench' },
    { label: 'Knowledge', path: '/knowledge' },
    { label: 'Runs', path: '/runs' },
    { label: 'Models', path: '/models' },
    { label: 'Documents', path: '/documents' },
    { label: 'Security', path: '/security' },
    { label: 'System', path: '/system' },
    { label: 'Settings', path: '/settings' },
  ];

  const getCurrentPageLabel = () => {
    const item = navItems.find((n) => location.pathname.startsWith(n.path));
    if (item) return item.label;
    if (location.pathname.startsWith('/knowledge-base')) return 'Knowledge';
    if (location.pathname.startsWith('/admin')) return 'System';
    return 'Workbench';
  };

  return (
    <>
      {/* Compact Floating Glass Navbar */}
      <header className="fixed top-[14px] left-1/2 -translate-x-1/2 z-50 h-[54px] w-fit max-w-[1100px] min-w-[320px] px-3.5 glass-navbar flex items-center justify-between gap-4 font-sans select-none shadow-md transition-all duration-200">
        {/* Left: Small Logo */}
        <div className="flex items-center shrink-0">
          <NavLink to="/" className="flex items-center gap-2">
            <CyberLogo size="sm" showSubtitle={false} />
          </NavLink>
        </div>

        {/* Center: Desktop Navigation (Single Line) */}
        <nav className="hidden lg:flex items-center gap-1 font-semibold text-[13px]">
          {navItems.map((item) => {
            const isActive =
              location.pathname.startsWith(item.path) ||
              (item.path === '/knowledge' && location.pathname.startsWith('/knowledge-base')) ||
              (item.path === '/system' && location.pathname.startsWith('/admin'));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`h-9 px-3 rounded-xl flex items-center transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-300/20 text-[#0C4A6E] border border-sky-400/30 shadow-xs font-bold'
                    : 'text-sky-900/80 hover:text-[#0C4A6E] hover:bg-white/40'
                }`}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Right: ● Local + Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/60 border border-sky-200 text-sky-900 text-[11px] font-bold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Local</span>
          </div>

          <div className="w-7 h-7 rounded-xl bg-sky-100/80 border border-sky-300 flex items-center justify-center text-sky-800 font-bold shrink-0 shadow-xs cursor-pointer hover:bg-white transition-colors">
            <User className="w-3.5 h-3.5" />
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-xl bg-white/60 text-sky-800 border border-sky-200"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Floating Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-6 top-20 z-50 lg:hidden rounded-2xl glass-panel border border-sky-300 p-4 shadow-2xl space-y-2 animate-in fade-in duration-200">
          <div className="text-[11px] font-bold text-sky-700 px-3 py-1 uppercase tracking-wider">
            Navigation ({getCurrentPageLabel()})
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl font-bold text-xs transition-all text-left ${
                    isActive
                      ? 'bg-sky-400/20 text-[#0C4A6E] border border-sky-300'
                      : 'text-sky-900 hover:bg-white/50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
