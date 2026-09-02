import React, { useState } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { Search, Bell, Menu, ChevronRight, User } from 'lucide-react';
import { SecurityIndicator } from '../ui/SecurityIndicator';

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/workbench')) return 'Workbench';
    if (path.startsWith('/runs')) return 'Runs';
    if (path.startsWith('/results')) return 'Results';
    if (path.startsWith('/knowledge-base')) return 'Knowledge Base';
    if (path.startsWith('/documents')) return 'Documents';
    if (path.startsWith('/models')) return 'Models';
    if (path.startsWith('/security')) return 'Security';
    if (path.startsWith('/admin')) return 'System';
    if (path.startsWith('/settings')) return 'Settings';
    return 'Workbench';
  };

  const pageTitle = getPageTitle();

  return (
    <header className="sticky top-0 z-30 h-14 bg-white/40 backdrop-blur-md border-b border-sky-200/60 px-4 lg:px-6 flex items-center justify-between font-sans">
      {/* Left: CYBERNEX / Current Page */}
      <div className="flex items-center gap-2 text-xs font-bold text-sky-900">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-1.5 rounded-lg bg-white/80 text-sky-800 border border-sky-200"
        >
          <Menu className="w-4 h-4" />
        </button>

        <NavLink to="/workbench" className="text-sky-700 hover:text-sky-950 font-semibold">CYBERNEX</NavLink>
        <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
        <span className="text-[#0C4A6E] font-black">{pageTitle}</span>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center max-w-sm w-full relative mx-4">
        <Search className="w-3.5 h-3.5 text-sky-500 absolute left-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-8 pr-3 py-1.5 rounded-xl glass-input text-xs text-sky-950 placeholder-sky-400 font-medium"
        />
      </div>

      {/* Right: ● Local, Notifications, Profile */}
      <div className="flex items-center gap-3">
        <SecurityIndicator compact />

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-xl bg-white/70 hover:bg-white text-sky-700 border border-sky-200 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel border border-sky-300 p-4 shadow-xl backdrop-blur-xl z-50">
              <div className="text-xs font-black text-[#0C4A6E] pb-2 border-b border-sky-200/60 mb-2">
                Notifications
              </div>
              <div className="space-y-2 text-xs font-medium text-sky-900">
                <p>Task run-8942-cx finished</p>
                <p className="text-[11px] text-sky-700">Generated Approval_Note.docx</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
