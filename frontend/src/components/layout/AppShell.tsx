import React from 'react';
import { Outlet } from 'react-router-dom';
import { WorkspaceNavbar } from '../navigation/WorkspaceNavbar';
import { Toast } from '../ui/Toast';
import { useApp } from '../../context/AppContext';

export const AppShell: React.FC = () => {
  const { toastMessage, showToast } = useApp();

  return (
    <div className="min-h-screen bg-[#F5FBFF] text-[#0C4A6E] relative cyber-bg-grid font-sans overflow-x-hidden">
      {/* Background Glows */}
      <div className="cyber-glow-top" />
      <div className="cyber-glow-right" />

      {/* Compact Floating Glass Navbar */}
      <WorkspaceNavbar />

      {/* Full-Width Workspace Container */}
      <main className="w-full max-w-[1400px] mx-auto pt-[96px] px-8 pb-16 relative z-10 min-h-screen">
        <Outlet />
      </main>

      {/* Global Toast */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => showToast('')} />
      )}
    </div>
  );
};
