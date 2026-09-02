import React, { useState } from 'react';
import { Palette, User, Cpu, Shield, Bell } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'models' | 'security' | 'notifications'>('appearance');

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-sky-200">
        <div>
          <h2 className="text-3xl font-black text-[#0C4A6E] tracking-tight">
            Settings
          </h2>
          <p className="text-xs text-sky-800 font-medium mt-0.5">
            Workspace preferences.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-sky-200 pb-2 text-xs font-bold overflow-x-auto">
        {[
          { id: 'appearance', label: 'Appearance', icon: Palette },
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'models', label: 'Models', icon: Cpu },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all shrink-0 ${
                isActive
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-sky-800 hover:text-sky-950 hover:bg-sky-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'appearance' && (
        <GlassCard gradient className="p-6 space-y-4 border-sky-300">
          <h3 className="text-xs font-bold text-sky-900 uppercase">Appearance</h3>

          <div className="p-4 rounded-2xl bg-white/70 border border-sky-200 flex items-center justify-between">
            <div>
              <span className="text-sm font-black text-[#0C4A6E]">Light Sky-Blue Glass</span>
              <p className="text-xs text-sky-900 font-medium mt-0.5">CYBERNEX glass theme active.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold">
              Active
            </span>
          </div>
        </GlassCard>
      )}

      {activeTab === 'profile' && (
        <GlassCard className="p-6 space-y-4 border-sky-300">
          <h3 className="text-xs font-bold text-sky-900 uppercase">Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
            <div>
              <label className="text-sky-900 block mb-1">Email</label>
              <input type="text" readOnly value="lead.security@cybernex.local" className="w-full p-3 rounded-xl glass-input text-sky-950" />
            </div>
            <div>
              <label className="text-sky-900 block mb-1">Role</label>
              <input type="text" readOnly value="Level 5 Admin" className="w-full p-3 rounded-xl glass-input text-emerald-700" />
            </div>
          </div>
        </GlassCard>
      )}

      {activeTab === 'models' && (
        <GlassCard className="p-6 space-y-2 border-sky-300">
          <h3 className="text-xs font-bold text-sky-900 uppercase">Hardware</h3>
          <p className="text-xs text-sky-900 font-bold">Max VRAM Limit: 48.0 GB (RTX 6000 Ada)</p>
        </GlassCard>
      )}

      {activeTab === 'security' && (
        <GlassCard className="p-6 space-y-2 border-emerald-300">
          <h3 className="text-xs font-bold text-emerald-800 uppercase">Air-Gap Protection</h3>
          <p className="text-xs text-emerald-700 font-bold">All external AI calls are hard-disabled.</p>
        </GlassCard>
      )}

      {activeTab === 'notifications' && (
        <GlassCard className="p-6 space-y-2 border-sky-300">
          <h3 className="text-xs font-bold text-sky-900 uppercase">Notifications</h3>
          <p className="text-xs text-sky-900 font-bold">Desktop notifications enabled for task run completion.</p>
        </GlassCard>
      )}
    </div>
  );
};
