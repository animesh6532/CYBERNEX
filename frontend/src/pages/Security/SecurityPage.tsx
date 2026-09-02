import React from 'react';
import { ShieldCheck, Cpu, Database, Terminal, Shield, User } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatCard } from '../components/ui/StatCard';
import { useApp } from '../context/AppContext';

export const SecurityPage: React.FC = () => {
  const { systemMetrics } = useApp();

  const capabilities = [
    { title: 'Local models', desc: 'Models run locally.', icon: Cpu },
    { title: 'Private knowledge', desc: 'Your data stays on your system.', icon: Database },
    { title: 'Sandboxed code', desc: 'Code runs inside isolated containers.', icon: Terminal },
    { title: 'Controlled network', desc: 'Network activity is verifiable.', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      {/* Heading */}
      <div className="flex items-center justify-between pb-2 border-b border-sky-200">
        <div>
          <h2 className="text-3xl font-black text-[#0C4A6E] tracking-tight">
            Security
          </h2>
          <p className="text-xs text-sky-800 font-medium mt-0.5">
            See how your data is protected.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>System secure</span>
        </div>
      </div>

      {/* 4 Clean Glass Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="External AI calls" value="0" />
        <StatCard title="Cloud model calls" value="0" />
        <StatCard title="External connections" value="0" />
        <StatCard title="Data sent outside" value="0 B" />
      </div>

      {/* Security Visualization */}
      <GlassCard gradient className="p-8 space-y-6 border-sky-300 text-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-[#0C4A6E]">System secure</h3>
          <p className="text-xs text-sky-800 font-bold uppercase tracking-wider">LOCAL INFRASTRUCTURE</p>
        </div>

        {/* Visual Connection Flow */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 font-sans text-xs font-bold text-[#0C4A6E]">
          <span className="px-3.5 py-2 rounded-xl bg-white/80 border border-sky-200 shadow-xs flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-sky-600" /> User
          </span>
          <span className="text-sky-400">→</span>
          <span className="px-3.5 py-2 rounded-xl bg-white/90 border border-sky-300 shadow-sm flex items-center gap-1.5 text-sky-950 font-black">
            <Shield className="w-3.5 h-3.5 text-sky-600" /> CYBERNEX
          </span>
          <span className="text-sky-400">→</span>
          <span className="px-3.5 py-2 rounded-xl bg-white/80 border border-sky-200 shadow-xs flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-sky-600" /> Local Models
          </span>
          <span className="text-sky-400">→</span>
          <span className="px-3.5 py-2 rounded-xl bg-white/80 border border-sky-200 shadow-xs flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-sky-600" /> Local Knowledge
          </span>
          <span className="text-sky-400">→</span>
          <span className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 shadow-xs flex items-center gap-1.5">
            Local Output
          </span>
        </div>
      </GlassCard>

      {/* 4 Compact Capabilities Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {capabilities.map((cap, idx) => {
          const Icon = cap.icon;
          return (
            <GlassCard key={idx} hoverEffect className="p-5 space-y-2 border-sky-300">
              <div className="p-2 rounded-xl bg-sky-100/70 border border-sky-300 text-sky-700 w-fit">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black text-[#0C4A6E]">{cap.title}</h4>
              <p className="text-xs text-sky-900 font-medium leading-relaxed">{cap.desc}</p>
            </GlassCard>
          );
        })}
      </div>

      {/* System Monitor */}
      <GlassCard className="p-6 space-y-4 border-sky-300">
        <h3 className="text-xs font-bold text-sky-900 uppercase">System Monitor</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans text-xs">
          {[
            { label: 'GPU', val: `${systemMetrics.gpuUsage}%` },
            { label: 'CPU', val: `${systemMetrics.cpuUsage}%` },
            { label: 'Memory', val: `${systemMetrics.memoryUsage}%` },
            { label: 'Storage', val: `${systemMetrics.storageUsage}%` },
          ].map((item, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between font-black text-[#0C4A6E]">
                <span>{item.label}</span>
                <span>{item.val}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-sky-100 border border-sky-200 overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: item.val }} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
