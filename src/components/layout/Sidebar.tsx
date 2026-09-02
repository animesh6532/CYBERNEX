import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  Activity,
  Cpu,
  FileText,
  ShieldCheck,
  Server,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  ExternalLink,
} from 'lucide-react';
import { CyberLogo } from '../ui/CyberLogo';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const { sidebarCollapsed, setSidebarCollapsed } = useApp();

  const navGroups = [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Workbench', path: '/workbench', icon: LayoutDashboard },
        { label: 'Knowledge', path: '/knowledge-base', icon: Database },
        { label: 'Runs', path: '/runs', icon: Activity },
        { label: 'Models', path: '/models', icon: Cpu },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Documents', path: '/documents', icon: FileText },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Security', path: '/security', icon: ShieldCheck },
        { label: 'System', path: '/admin', icon: Server },
        { label: 'Settings', path: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-sky-950/20 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen glass-panel border-r border-sky-200/80 flex flex-col justify-between transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-60'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div>
          <div className="p-5 border-b border-sky-200/50 flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2">
              <CyberLogo size={sidebarCollapsed ? 'sm' : 'md'} showSubtitle={!sidebarCollapsed} />
            </NavLink>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-1 rounded-xl bg-white/70 hover:bg-sky-50 text-sky-700 border border-sky-200 transition-colors"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-170px)] font-sans">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {!sidebarCollapsed && (
                  <h3 className="px-3 text-[10px] font-sans font-black tracking-widest text-sky-800/80 mb-1.5 uppercase">
                    {group.title}
                  </h3>
                )}
                {group.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={iIdx}
                      to={item.path}
                      onClick={onMobileClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-xl font-bold text-xs transition-all duration-200 ${
                          isActive
                            ? 'bg-sky-400/20 text-[#0C4A6E] border border-sky-300/80 shadow-xs'
                            : 'text-sky-900/80 hover:text-[#0C4A6E] hover:bg-sky-200/30'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0 text-sky-600" />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-sky-200/50 bg-white/30 font-sans">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-800 font-bold shrink-0">
                <User className="w-4 h-4" />
              </div>

              {!sidebarCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-black text-[#0C4A6E] truncate">Security Lead</span>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <div className="flex items-center gap-1 text-emerald-700 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Local</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
