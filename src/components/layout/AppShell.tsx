import React from 'react';
import { Outlet } from 'react-router-dom';
import { FloatingNavbar } from './FloatingNavbar';
import { Toast } from '../ui/Toast';
import { useApp } from '../../context/AppContext';

export const AppShell: React.FC = () => {
  const { toastMessage, showToast } = useApp();

  return (
    <div className="min-h-screen bg-[#F5FBFF] text-[#0C4A6E] relative cyber-bg-grid font-sans overflow-x-hidden">
      {/* Atmosphere Glows */}
      <div className="cyber-glow-top" />
      <div className="cyber-glow-right" />

      {/* Single Floating Control Surface Navbar */}
      <FloatingNavbar />

      {/* Full-Width Application Container (No Sidebar) */}
      <main className="w-full max-w-[1500px] mx-auto pt-[110px] px-8 pb-16 relative z-10 min-h-screen">
        <Outlet />
      </main>

      {/* Global Toast */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => showToast('')} />
      )}
    </div>
  );
};
