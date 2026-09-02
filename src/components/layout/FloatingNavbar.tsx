import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Bell, User, Menu, X, CheckCircle2 } from 'lucide-react';
import { CyberLogo } from '../ui/CyberLogo';

export const FloatingNavbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navItems = [
    { label: 'Workbench', path: '/workbench' },
    { label: 'Knowledge', path: '/knowledge-base' },
    { label: 'Runs', path: '/runs' },
    { label: 'Models', path: '/models' },
    { label: 'Documents', path: '/documents' },
    { label: 'Security', path: '/security' },
    { label: 'System', path: '/admin' },
    { label: 'Settings', path: '/settings' },
  ];

  const getCurrentPageLabel = () => {
    const item = navItems.find((n) => location.pathname.startsWith(n.path));
    return item ? item.label : 'Workbench';
  };

  return (
    <>
      {/* Floating Control Surface Navbar */}
      <header className="fixed top-4.5 left-6 right-6 z-50 h-16 glass-navbar px-6 flex items-center justify-between font-sans select-none transition-all duration-300">
        {/* Left: Brand */}
        <div className="flex items-center gap-4">
          <NavLink to="/" className="flex items-center gap-2">
            <CyberLogo size="md" showSubtitle={false} />
          </NavLink>
        </div>

        {/* Center: Desktop Navigation (Single Horizontal Line) */}
        <nav className="hidden lg:flex items-center gap-1.5 font-bold text-xs">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-300/20 text-[#0C4A6E] border border-sky-400/30 shadow-[0_4px_18px_rgba(56,189,248,0.12)]'
                    : 'text-sky-900/80 hover:text-[#0C4A6E] hover:bg-white/40'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Security Badge, Notifications, Profile Avatar */}
        <div className="flex items-center gap-3">
          {/* Compact Air-Gap Status Indicator */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 border border-sky-200 text-sky-900 text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>LOCAL</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl bg-white/60 hover:bg-white text-sky-800 border border-sky-200 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-72 rounded-2xl glass-panel border border-sky-300 p-4 shadow-xl backdrop-blur-2xl z-50">
                <div className="text-xs font-black text-[#0C4A6E] pb-2 border-b border-sky-200 mb-2">
                  Notifications
                </div>
                <div className="space-y-2 text-xs font-medium text-sky-900">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#0C4A6E]">Task completed</p>
                      <p className="text-[11px] text-sky-700">Approval_Note_Unit4.docx generated</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="w-8 h-8 rounded-xl bg-sky-100/80 border border-sky-300 flex items-center justify-center text-sky-800 font-bold shrink-0 shadow-xs">
            <User className="w-4 h-4" />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/60 text-sky-800 border border-sky-200"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Floating Glass Navigation Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-6 top-24 z-50 lg:hidden rounded-2xl glass-panel border border-sky-300 p-4 shadow-2xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-xs font-bold text-sky-700 px-3 py-1 uppercase tracking-wider">
            Navigation ({getCurrentPageLabel()})
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl font-bold text-xs transition-all text-left ${
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
